class NoExpensesForUser extends Error {
    constructor() {
        super("no expenses were found for this user");
        this.name = "NoExpensesForUser";
    }
}

class NoExpensesBetweenDates extends Error {
    constructor() {
        super("no Expenses were found for this user in those current dates");
    }
}

class NoExpensesWithCurrentCategory extends Error {
    constructor() {
        super("no Expenses were found for this user with this category");
    }
}

export {NoExpensesForUser, NoExpensesBetweenDates, NoExpensesWithCurrentCategory}