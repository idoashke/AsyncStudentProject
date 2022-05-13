class NoExpensesForUser extends Error {
    constructor() {
        super("no expenses were found for this user");
        this.name = "NoExpensesForUser";
    }
}
export {NoExpensesForUser}