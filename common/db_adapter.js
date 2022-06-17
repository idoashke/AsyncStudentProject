import mongoose from "mongoose";
import {NoExpensesForUser, NoExpensesBetweenDates, NoExpensesWithCurrentCategory} from "./errors.js";
import expenses from "../routes/expenses.js";

const connection = await mongoose.connect("mongodb+srv://admin:Password1@cluster0.umbnu.mongodb.net/expenses_tracker_app")

const Expenses = connection.model('costs', {
    user_id: {type: String}, expenses: {type: Array}, sum: {type: Number}
})


async function is_cost_doc_exist(user_id) {
    const doc = await Expenses.findOne({user_id: user_id});
    if (doc == null) {
        return false
    }
    return doc
}

async function get_all_expenses_by_user_id(user_id) {
    const doc = await is_cost_doc_exist(user_id);
    if ((doc === false) || (doc['expenses'].length < 1)) {
        throw new NoExpensesForUser()
    }
    return {
        "expenses": doc.toJSON()["expenses"],
        "sum": doc.toJSON()["sum"]
    }
}

async function get_expenses_list_from_docs(docs) {
    const expenses_list = []
    for (let i = 0; i < docs.length; i++) {
        expenses_list.push(docs[i]["expenses"])
    }
    return expenses_list
}

async function get_current_sum_by_user_id(user_id) {
    const doc = await Expenses.findOne({user_id: user_id});
    return doc.toJSON()["sum"]
}


async function add_new_expense_by_user_id(user_id, expense) {
    if (await is_cost_doc_exist(user_id) === false) {
        const doc = new Expenses({user_id: user_id, expense: [], sum: 0})
        await doc.save()
    }
    let new_sum = await get_current_sum_by_user_id(user_id)
    new_sum = new_sum + expense.cost
    await Expenses.updateOne({user_id: user_id}, {$push: {expenses: expense}, $set: {sum: new_sum}});
}


async function get_expenses_statistic_by_dates(user_id, start_date, end_date) {
    const sum_by_dates = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: user_id,
            "expenses.date": {$gte: start_date, $lt: end_date}
        }
    }, {$group: {_id: null, sum: {$sum: "$expenses.cost"}}}
    ])
    const docs_by_dates = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: user_id,
            "expenses.date": {$gte: start_date, $lt: end_date}
        }
    }
    ])
    if ((docs_by_dates == null) || docs_by_dates.length === 0) {
        throw new NoExpensesBetweenDates()
    }


    return {
        "number_of_expences": docs_by_dates.length,
        "sum_of_expenses": sum_by_dates[0]["sum"],
        "expenses": await get_expenses_list_from_docs(docs_by_dates)
    }
}

async function get_expenses_statistic_by_category(user_id, category) {
    const sum_by_category = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: user_id,
            "expenses.category": category
        }
    }, {$group: {_id: null, sum: {$sum: "$expenses.cost"}}}
    ])

    const docs_by_category = await Expenses.aggregate([{$unwind: "$expenses"}, {
        $match: {
            user_id: user_id,
            "expenses.category": category
        }
    }
    ])
    if ((docs_by_category == null) || docs_by_category.length === 0) {
        throw new NoExpensesWithCurrentCategory()
    }
    return {
        "number_of_expences": docs_by_category.length,
        "sum_of_expenses": sum_by_category[0]["sum"],
        "expenses": await get_expenses_list_from_docs(docs_by_category)
    }

}

const User = connection.model('users', {
    user_id: {type: String},
    first_name: {type: String},
    last_name: {type: String},
    password: {type: String},
    birthday: {type: Date},
    marital_status: {type: String}
})


async function insert_new_user(user) {
    const user_doc = new User({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.first_name,
        password: user.password,
        birthday: user.birthday,
        marital_status: user.marital_status
    })

    await user_doc.save()

}

async function is_user_exists(user_id) {
    const doc = await User.findOne({user_id: user_id});
    return doc != null;


}
async function get_user_by_username(user_id) {
    const doc = await User.findOne({user_id: user_id});
    return  doc.toJSON()
}


export {
    get_all_expenses_by_user_id,
    add_new_expense_by_user_id,
    get_expenses_statistic_by_dates,
    get_expenses_statistic_by_category,
    insert_new_user,
    is_user_exists,
    get_user_by_username
}