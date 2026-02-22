import { TestBed } from '@angular/core/testing'
import { CanActivateFn, Router, UrlTree } from '@angular/router'
import { AuthService } from '../../auth/service/auth.service'
import { authGuard } from './auth.guard'

describe('authGuard', () => {
    let authService: jasmine.SpyObj<AuthService>
    let router: jasmine.SpyObj<Router>

    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authGuard(...guardParameters))

    beforeEach(() => {
        authService = jasmine.createSpyObj('AuthService', ['isLoggedIn'])
        router = jasmine.createSpyObj('Router', ['createUrlTree'])

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
            ],
        })
    })

    it('should be created', () => {
        expect(executeGuard).toBeTruthy()
    })

    it('should return true when user is logged in', () => {
        authService.isLoggedIn.and.returnValue(true)
        const result = executeGuard({} as any, {} as any)
        expect(result).toBeTrue()
        expect(router.createUrlTree).not.toHaveBeenCalled()
    })

    it('should redirect to when user is not logged in', () => {
        authService.isLoggedIn.and.returnValue(false)
        const urlTree = {} as UrlTree
        router.createUrlTree.and.returnValue(urlTree)
        const result = executeGuard({} as any, {} as any)

        expect(result).toBe(urlTree) // must redirect
        expect(router.createUrlTree).toHaveBeenCalled() // to somewhere
    })
})
