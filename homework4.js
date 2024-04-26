const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com",
    address: {}
}


Object.keys(person).forEach(prop => {
    Object.defineProperty(person, prop, {
        writable: false
    })
})

Object.defineProperty(person, 'updateInfo', {
    value: function(info) {
        Object.keys(info).forEach(prop => {
            if (this.hasOwnProperty(prop)) {
            this[prop] = info[prop]
            }
        })
    }
})

Object.defineProperty(person, 'address', {
    value: {},
    writable: true,
    enumerable: false,
    configurable: false
})

console.log(person.firstName)
person.firstName = "Bob"
console.log(person.firstName)

person.updateInfo({ firstName: "Bob", age: 32 })
console.log(person.firstName)
console.log()





const product = {
    name: "Laptop",
    price: 1000,
    quantity: 5,
    test: "test"
}

Object.defineProperty(product, 'price', {
    writable: false,
    enumerable: false
})
  
Object.defineProperty(product, 'quantity', {
    writable: false,
    enumerable: false
})

function getTotalPrice(product) {
    const price = Object.getOwnPropertyDescriptor(product, 'price')
    const quantity = Object.getOwnPropertyDescriptor(product, 'quantity')
  
    const totalPrice = price.value * quantity.value
    return totalPrice
}

function deleteNonConfigurable(obj, name) {
    if (obj.hasOwnProperty(name)) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, name)
        if (!descriptor.configurable) {
            throw new Error(`Cannot delete ${name}, because it is non-configurable`)
        }
        delete obj[name];
    }
}

Object.defineProperty(product, "test", {
    configurable: false
})

console.log(getTotalPrice(product))

try {
    deleteNonConfigurable(product, 'test')
} catch (error) {
    console.log(error.message)
}
console.log(product)
  



const bankAccount = {
    Balance: 1000,

    get formattedBalance() {
        return `$${this.Balance}`
    },

    set balance(newBalance) {
        this.Balance = newBalance
    },

    transfer(target, amount) {
        if (this.Balance >= amount) {
            this.Balance -= amount
            target.Balance += amount
            console.log("transferred")
        } else {
            console.log("failed")
        }
    }
}


const bankAccount2 = {
    Balance: 1000,

    get formattedBalance() {
        return `$${this.Balance}`
    },

    set balance(newBalance) {
        this.Balance = newBalance
    },

    transfer(target, amount) {
        if (this.Balance >= amount) {
            this.Balance -= amount
            target.Balance += amount
            console.log("transferred")
        } else {
            console.log("failed")
        }
    }
}

console.log()
console.log(bankAccount.formattedBalance)
bankAccount.transfer(bankAccount2, 100)
console.log(bankAccount.formattedBalance)
console.log(bankAccount2.formattedBalance)




function createImmutableObject(object) {
    if (typeof(object) != "object")
        return object

    const immutable = {}

    Object.keys(object).forEach(prop => {
        immutable[prop] = createImmutableObject(object[prop])

        Object.defineProperty(immutable, prop, {
            value: immutable[prop],
            writable: false
        })
    })

    return immutable
}

console.log()
const immutable = createImmutableObject(person)
console.log(immutable)





function observeObject(object, callback) {
    return new Proxy(object, {
        get(target, property) {
            callback(property, "get")
            return Reflect.get(target, property)
        },
        set(target, property) {
            callback(property, "set")
            return Reflect.get(target, property)
        }
    })
}

function callback(prop, action) {
    console.log(`${prop}, ${action}`)
}

console.log()
const observer = observeObject(person, callback)
console.log(observer.firstName)
observer.firstName = "Bob"




function deepCloneObject(object, cloned = []) {
    if (typeof object != "object") {
        return object;
    }

    const clone = {}

    for (const o of cloned) {
        if (o.original == object)
            return o.clone
    }

    cloned.push({ original: object, clone })

    Object.keys(object).forEach(key => {
        clone[key] = deepCloneObject(object[key], cloned);
    })

    return clone;
}

const original = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com",
    address: {
        country: "USA"
    }
}

original.self = original
const cloned = deepCloneObject(original)

console.log()
console.log(cloned)
console.log(original)





function validateObject(object, schema) {
    for (const prop in schema) {
        if (schema[prop].required && !(prop in object))
            return false

        if (schema[prop].type && typeof(object[prop]) != schema[prop].type)
            return false
    }

    return true
}


const schema = {
    firstName: {type: "string", required: true},
    lastName: {type: "string", requested: true},
    age: {type: "number", requested: true}
}


const test = {
    firstName: "John",
    lastName: "Doe",
    age: 30
}

const test2 = {
    firstName: "John",
    lastName: "Doe"
}

console.log()
console.log(validateObject(test, schema))
console.log(validateObject(test2, schema))
