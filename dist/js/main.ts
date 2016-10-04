interface Person {
    firstName: string;
    lastName: string;
}

class Student implements Person {
    firstName: string;
    constructor(public firstName: string, public lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

}