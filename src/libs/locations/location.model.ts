export interface SubDistrict {
    id: string
    name: string
}

export interface District {
    id: string
    name: string
    subDistricts: SubDistrict[]
}

export interface Region {
    id: string
    name: string
    districts: District[]
}

export interface Country {
    id: string
    name: string
    regions: Region[]
}

export interface CountryWrapper {
    country: Country
}
