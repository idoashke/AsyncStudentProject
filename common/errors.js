class NoExpensesForUser extends Error {
    constructor() {
        super("No expenses were found for this user");
        this.name = "NoExpensesForUser";
    }
}

class NoExpensesBetweenDates extends Error {
    constructor() {
        super("No Expenses were found for this user in those current dates");
    }
}

class NoExpensesWithCurrentCategory extends Error {
    constructor() {
        super("No Expenses were found for this user with this category");
    }
}

class UserAlreadyExist extends  Error {
    constructor() {
        super("User is already exists");
    }
}

export {NoExpensesForUser, NoExpensesBetweenDates, NoExpensesWithCurrentCategory, UserAlreadyExist}