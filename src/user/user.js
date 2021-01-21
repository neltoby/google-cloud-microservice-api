module.exports = function buildUsers ({ hash, emailMatch }) {
    return function makeUser(props) {
        class Users {
            constructor({name, email, country, state, municipal} = props){
                if(!name){
                    throw new Error('Name cannot be empty')
                }
                if(!email){
                    throw new Error('Email cannot be empty')
                }
                // if(!password){
                //     throw new Error('Password cannot be empty')
                // }
                if(emailMatch(email) === false){
                    throw new Error('Email is not valid')
                }
                if(!country){
                    throw new Error('Country cannot be empty')
                }
                if(!state){
                    throw new Error('State cannot be empty')
                }
                if(!municipal){
                    throw new Error('Municipal cannot be empty')
                } 
                this.name = name
                this.email = email
                this.password = null
                this.country = country
                this.state = state
                this.municipal = municipal
                this.id = null
                this.createdOn = Date.now()
            }

            get getName () {
                return this.name
            }
            
            get getEmail () {
                return this.email
            }

            get getPassword () {
                return this.password
            }

            get getCountry () {
                return this.country
            }

            get getState () {
                return this.state
            }

            get getMunicipal () {
                return this.municipal
            }

            get getId () {
                return this.id
            }

            setId (id) {
                if(!id){
                    throw new Error('Id cannot be empty')
                }
                this.id = id
            }

            setName (name) {
                if(!name){
                    throw new Error('Name cannot be empty')
                }
                this.name = name
            }

            setEmail(email) {
                if(!email){
                    throw new Error('Email cannot be empty')
                }
                if(emailMatch(email) === false){
                    throw new Error('Email is not valid')
                }
                this.email = email
            }

            setPassword(password) {
                if(!password){
                    throw new Error('Password cannot be empty')
                }
                this.password = hash(password)
            }

            setCountry(country) {
                if(!country){
                    throw new Error('Country cannot be empty')
                }
                this.country = country
            }

            setState(state) {
                if(!state){
                    throw new Error('State cannot be empty')
                }
                this.state = state
            }

            setMunicipal(municipal) {
                if(!municipal){
                    throw new Error('Municipal cannot be empty')
                }
                this.municipal = municipal
            }

            setCreatedOn(date) {
                if(!date){
                    throw new Error('Date cannot be empty')
                }
                this.createdOn = date
            }

        }
        return new Users()
    }
}