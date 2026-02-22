import { CommonModule } from '@angular/common'
import { Component, inject, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { CardModule } from 'primeng/card'
import { DialogModule } from 'primeng/dialog'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputTextModule } from 'primeng/inputtext'
import { SelectModule } from 'primeng/select'
import { SkeletonModule } from 'primeng/skeleton'
import { TagModule } from 'primeng/tag'
import { filter, map, Observable, take, tap } from 'rxjs'
import { AlertService } from '../../../common-service/lib/alert.service'
import {
    Country,
    CountryWrapper,
    District,
    Region,
    SubDistrict,
} from '../../../locations/location.model'
import { LocationStateService } from '../../../locations/location-state.service'
import { UserProfileFormService } from '../../user-profile.form.service'
import { UserProfile } from '../../user-profile.model'
import { UserProfileStateService } from '../../user-profile-state.service'

@Component({
    selector: 'app-user-profile-card',
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        ReactiveFormsModule,
        FloatLabelModule,
        InputTextModule,
        FormsModule,
        SelectModule,
        CardModule,
        SkeletonModule,
        TagModule,
    ],
    templateUrl: './user-card.component.html',
    styleUrl: './user-card.component.css',
})
export class UserProfileCardComponent implements OnInit {
    private stateService = inject(UserProfileStateService)
    private formService = inject(UserProfileFormService)
    private alertService = inject(AlertService)
    private locationState = inject(LocationStateService)

    editMode = false
    userProfile$!: Observable<UserProfile | null>
    loading$!: Observable<boolean>

    // options for dropdowns
    countries: Country[] = []
    regions: Region[] = []
    districts: District[] = []
    subDistricts: SubDistrict[] = []

    // locations loaded flag (for view mode)
    locationsLoaded$!: Observable<boolean>

    ngOnInit() {
        // 1) Profile
        this.userProfile$ = this.stateService.select('userProfile').pipe(
            map((profile) => {
                if (profile) {
                    console.log('LOG user profile from state:', profile)
                    this.formService.patchForm(profile)
                }
                return profile
            }),
        )
        this.loading$ = this.stateService.select('loading')

        // 2) Locations loaded flag
        this.locationsLoaded$ = this.locationState.select('loaded')

        // 3) Locations – wait for first non-empty emission
        this.locationState
            .selectAllCountries()
            .pipe(
                tap((wrappers: any) =>
                    console.log('LOG selectAllCountries emission:', wrappers),
                ),
                filter((wrappers) => wrappers && wrappers.length > 0),
                take(1),
            )
            .subscribe((wrappers: CountryWrapper[]) => {
                console.log(
                    'LOG non-empty location wrappers from state:',
                    wrappers,
                )
                this.countries = wrappers.map((w) => w.country)
                console.log('LOG countries array:', this.countries)
                this.syncLocationOptionsFromForm()
            })

        // 4) Setup cascading behavior between form controls
        this.setupLocationFormReactions()
    }

    private setupLocationFormReactions() {
        const form = this.formService.form

        // Country -> Regions
        form.get('countryId')?.valueChanges.subscribe(
            (countryId: string | null) => {
                console.log('LOG countryId changed:', countryId)
                const country = this.countries.find((c) => c.id === countryId)
                console.log('LOG selected country object:', country)
                this.regions = country?.regions ?? []
                this.districts = []
                this.subDistricts = []

                console.log('LOG regions after country change:', this.regions)

                // clear children without emitting extra valueChanges loops
                form.patchValue(
                    {
                        regionId: null,
                        districtId: null,
                        subDistrictId: null,
                    },
                    { emitEvent: false },
                )
            },
        )

        // Region -> Districts
        form.get('regionId')?.valueChanges.subscribe(
            (regionId: string | null) => {
                console.log('LOG regionId changed:', regionId)
                const region = this.regions.find((r) => r.id === regionId)
                console.log('LOG selected region object:', region)
                this.districts = region?.districts ?? []
                this.subDistricts = []

                console.log(
                    'LOG districts after region change:',
                    this.districts,
                )

                form.patchValue(
                    {
                        districtId: null,
                        subDistrictId: null,
                    },
                    { emitEvent: false },
                )
            },
        )

        // District -> SubDistricts
        form.get('districtId')?.valueChanges.subscribe(
            (districtId: string | null) => {
                console.log('LOG districtId changed:', districtId)
                const district = this.districts.find((d) => d.id === districtId)
                console.log('LOG selected district object:', district)
                this.subDistricts = district?.subDistricts ?? []

                console.log(
                    'LOG subDistricts after district change:',
                    this.subDistricts,
                )

                form.patchValue(
                    {
                        subDistrictId: null,
                    },
                    { emitEvent: false },
                )
            },
        )
    }

    /**
     * When the profile is patched into the form *and* locations are loaded,
     * rebuild current regions/districts/subDistricts based on selected IDs.
     */
    private syncLocationOptionsFromForm() {
        const form = this.formService.form
        const countryId = form.get('countryId')?.value
        const regionId = form.get('regionId')?.value
        const districtId = form.get('districtId')?.value

        console.log('LOG syncLocationOptionsFromForm - current IDs:', {
            countryId,
            regionId,
            districtId,
        })

        const country = this.countries.find((c) => c.id === countryId)
        this.regions = country?.regions ?? []

        const region = this.regions.find((r) => r.id === regionId)
        this.districts = region?.districts ?? []

        const district = this.districts.find((d) => d.id === districtId)
        this.subDistricts = district?.subDistricts ?? []

        console.log('LOG synced regions:', this.regions)
        console.log('LOG synced districts:', this.districts)
        console.log('LOG synced subDistricts:', this.subDistricts)
    }

    onEdit() {
        this.editMode = true
    }

    onCancel() {
        this.editMode = false

        this.userProfile$.pipe(take(1)).subscribe((profile) => {
            console.log('LOG onCancel, restoring profile:', profile)
            if (profile) {
                this.formService.patchForm(profile)
                this.syncLocationOptionsFromForm()
            }
        })
    }

    onSave(event: Event) {
        event.preventDefault()

        const updated = this.formService.getValue()
        console.log('LOG form value on save (will send to API):', updated)

        this.stateService
            .updateUserProfile(updated) // no id passed
            .pipe(take(1))
            .subscribe({
                next: () => {
                    console.log('LOG updateUserProfile success')
                    this.alertService.success(
                        'User profile updated successfully',
                    )
                    this.editMode = false
                },
                error: (err) => {
                    this.alertService.error('Failed to update user profile')
                    console.error('Update user profile error:', err)
                },
            })
    }

    // --- Helpers to display names in view mode ---

    getCountryName(id?: string | null): string {
        if (!id) return ''
        const wrappers = this.locationState.getAllCountriesSnapshot()
        const country = wrappers.find((w) => w.country.id === id)?.country
        return country?.name ?? ''
    }

    getRegionName(id?: string | null): string {
        if (!id) return ''
        const wrappers = this.locationState.getAllCountriesSnapshot()
        for (const w of wrappers) {
            const region = w.country.regions.find((r) => r.id === id)
            if (region) return region.name
        }
        return ''
    }

    getDistrictName(id?: string | null): string {
        if (!id) return ''
        const wrappers = this.locationState.getAllCountriesSnapshot()
        for (const w of wrappers) {
            for (const r of w.country.regions) {
                const district = r.districts.find((d) => d.id === id)
                if (district) return district.name
            }
        }
        return ''
    }

    getSubDistrictName(id?: string | null): string {
        if (!id) return ''
        const wrappers = this.locationState.getAllCountriesSnapshot()
        for (const w of wrappers) {
            for (const r of w.country.regions) {
                for (const d of r.districts) {
                    const sd = d.subDistricts.find((s) => s.id === id)
                    if (sd) return sd.name
                }
            }
        }
        return ''
    }

    get form() {
        return this.formService.form
    }
}
