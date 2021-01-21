module.exports = function buildPosts ({ sanitize, makeSource }) {
    return function makePost ({post, title, fullname, ownerId, createdOn, likes, reviews, published, comments, source, edited, editedOn, editedType}) {
        class Post {
            constructor({
                post, 
                title,
                fullname,
                ownerId, 
                createdOn, 
                likes,
                reviews, 
                published, 
                comments,
                source,
                edited,
                editedOn,
                editedType
            }){
                if(!post){
                    throw { statusCode: this.constructor.statusCode, message:'You did not have a content'}
                }
                if(!title){
                    throw { statusCode: this.constructor.statusCode, message:'Title does not have a content'}
                }
                if(!fullname){
                    throw { statusCode: this.constructor.statusCode, message: 'Fullname does not have a content'}
                }
                if(!ownerId){
                    throw { statusCode: this.constructor.statusCode, message: 'Unknown identifier'}
                }
                if(!source){
                    throw { statusCode: this.constructor.statusCode, message: 'Unknown address'}
                }
                if(sanitize(post).trim().length < 1){
                    throw { statusCode: this.constructor.statusCode, message: 'Invalid string type'}
                }
                if(sanitize(title).trim().length < 1){
                    throw {statusCode: this.constructor.statusCode, message: 'Invalid string type' }
                }

                this.source = makeSource(source)
                this.post = post
                this.title = title
                this.id = null
                this.ownerId = ownerId
                this.createdOn = createdOn
                this.likes = likes
                this.noOfLikes = this.likes.length
                this.reviews = reviews
                this.published = published
                this.comments = comments
                this.deletedOn = null
                this.edited = edited
                this.editedOn = editedOn
                this.editedType = editedType
                this.fullName = fullname
                this.editedSource = null
                this.deleted = false
                this.deleteType = null
                this.deletedSource = null
            }
            static statusCode = 400

            get getPost(){
                return this.post
            }

            get getTitle(){
                return this.title
            }

            get getOwnerId(){
                return this.ownerId
            }

            get getCreatedOn(){
                return this.createdOn
            }

            get getNoOfLikes(){
                return this.noOfLikes
            }

            get getReviews(){
                return this.reviews
            }

            get getPublished(){
                return this.published
            }

            get getComments(){
                return this.comments
            }

            get getSource(){
                return this.source
            }

            get getEditedSource(){
                return this.editedSource
            }

            get getId(){
                return this.id
            }

            get getDeleted(){
                return this.deleted
            }

            get getDeleteType(){
                return this.deleteType
            }

            get getDeletedOn(){
                return this.deletedOn
            }

            get getDeletedSource(){
                return this.deletedSource
            }

            get getFullname(){
                return this.fullName
            }

            get getEdited(){
                return this.edited
            }

            get getEditedType(){
                return this.editedType
            }

            get getEditedOn(){
                return this.editedOn
            }

            setPost(post) {
                if(!post){
                    throw { statusCode: this.constructor.statusCode, message: 'You did not have a content'}
                }
                if(sanitize(post).trim().length < 1){
                    throw { statusCode: this.constructor.statusCode, message: 'Invalid string type'}
                }
                this.post = post
                this.edited = true
                this.editedOn = Date.now()
                this.editedType = 'Post'
            }
            setTitle(title) {
                if(!title){
                    throw { statusCode: this.constructor.statusCode, message: 'Title does not have a content' }
                }
                if(sanitize(title).trim().length < 1){
                    throw { statusCode: this.constructor.statusCode, message: 'Invalid string type' }
                }
                this.title = title
                this.edited = true
                this.editedOn = Date.now()
                this.editedType = 'Title'
            }
            setEditedSource (source){
                if(!source){
                    throw {statusCode: this.constructor.statusCode, message:'Title does not have a content'}
                }
                if(source.constructor !== Object){
                    throw {statusCode: this.constructor.statusCode, message:`source must be of type Object ${typeof source} supplied`}
                }
                this.editedSource = makeSource(source)
            }
            setPostAndTitle({post, title}){
                if(!title){
                    throw { statusCode: this.constructor.statusCode, message: 'Title does not have a content'}
                }
                if(sanitize(title).trim().length < 1){
                    throw { statusCode: this.constructor.statusCode, message: 'Invalid string type'}
                }
                if(!post){
                    throw { statusCode: this.constructor.statusCode, message: 'You did not have a content'}
                }
                if(sanitize(post).trim().length < 1){
                    throw { statusCode: this.constructor.statusCode, message: 'Invalid string type'}
                }
                this.post = post
                this.title = title
                this.edited = true
                this.editedOn = Date.now()
                this.editedType = 'Post and Title'
            }
            setFullname(fullName) {
                if(!fullName){
                    throw { statusCode: this.constructor.statusCode, message: 'You have not set a name'}
                }
                this.fullName = fullName
            }

            deletePost(source) {
                if(!source){
                    throw {statusCode: this.constructor.statusCode, message: 'Request should have a source'}
                }
                if(source.constructor !== Object){
                    throw {statusCode: this.constructor.statusCode, message: `Source should be of type 'Object' instead ${typeof source} given`}
                }
                this.deletedSource = makeSource(source)
                this.post = null
                this.title = null
                // this.ownerId = null
                this.deletedOn = Date.now()
                this.deleted = true
                this.fullName = null
                if(this.comments.length){                   
                    this.deleteType = 'soft_delete'
                }else{
                    this.deleteType = 'hard_delete'
                    this.ownerId = null
                    this.id = null
                }
            }
            
            unpublished(){
                this.published = false
            }

            setId(id){
                if(!id){
                    throw { statusCode: this.constructor.statusCode, message: 'Post should have an id'}
                }
                this.id = id
            }

            setPublished(){
                this.published = true
            }
            setEdited(bool){
                this.edited = bool
            }
            setEditedOn(edited){
                this.editedOn = edited
            }
            setEditedType(value){
                this.editedType = value
            }
            setComments(comments){
                if(!comments){
                    throw {statusCode: this.constructor.statusCode, message: 'comments must be valid'}
                }
                this.comments = comments
            }           
        }
        return new Post({post, title, fullname, ownerId, createdOn, likes, reviews, published, comments, source, edited, editedOn, editedType})
    }
}