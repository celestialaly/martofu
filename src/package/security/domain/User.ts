export default class User {
    userId: number | null = null
    email: string = ''
    plainPasword: string = ''

    private constructor(userId: number | null, email: string) {
        this.userId = userId
        this.email = email
    }

    public static new(email: string, password: string): User {
        const user = new User(null, email);
        user.updatePassword(password)

        return user;
    }

    public updatePassword(plainPassword: string) {
        this.plainPasword = plainPassword
    }
}