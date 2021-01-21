module.exports = function buildMakeComment ({sanitize, makeSource}) {
    return function makeComment (props) {
        class Comment {
            constructor(
                {
                    postId, 
                    ownerId, 
                    comment, 
                    likes,
                    createdOn,
                    source,
                    published,
                    fullname
                } = props
            )
            {
                if(!postId){
                    throw { statusCode: this.constructor.statusCode, message: 'Comment should have a post id' };
                }
                if(!ownerId){
                    throw { statusCode: this.constructor.statusCode, message: 'Comment should have a user identifier' };
                }
                if(!comment){
                    throw { statusCode: this.constructor.statusCode, message: 'Comment should have content' };
                }
                if(sanitize(comment).trim().length < 1){
                    throw {statusCode: this.constructor.statusCode, message: 'Comment should have a valid content' };
                }
                if(!likes){
                    throw { statusCode: this.constructor.statusCode, message: 'Property "likes" missing' };
                }
                if(!source){
                    throw { statusCode: this.constructor.statusCode, message: 'Comment should have a source' };
                }
                if(!fullname){
                    throw { statusCode: this.constructor.statusCode, message: 'Comment should have a fullname' };
                }

                this.id = null
                this.postId = postId;
                this.ownerId = ownerId;
                this.comment = comment;
                this.likes = likes;
                this.published = published;
                this.fullName = fullname;
                this.createdOn = createdOn;
                this.deleted = false;
                this.deletedOn = null;
                this.deleteType = null;
                this.deleteSource = null;
                this.edited = false;
                this.editedOn = null;
                this.editedSource = null;
                this.source = makeSource(source);
            }

            static statusCode = 400;

            get getId(){
                return this.id;
            }

            get getPostId() {
                return this.postId;
            }

            get getOwnerId() {
                return this.ownerId;
            }

            get getComment(){
                return this.comment;
            }

            get getFullname(){
                return this.fullName;
            }

            get getPublished(){
                return this.published;
            }

            get getCreatedOn() {
                return this.createdOn;
            }

            get getLikes() {
                return this.likes;
            }

            get getDeleted(){
                return this.deleted
            }

            get getDeletedOn(){
                return this.deletedOn;
            }

            get getEdited(){
                return this.edited;
            }

            get getEditedOn(){
                return this.editedOn;
            }

            get getSource(){
                return this.source;
            }

            get getEditedSource(){
                return this.editedSource;
            }

            get getDeleteSource(){
                return this.deleteSource;
            }

            setId(id){
                if(!id){
                    throw {statusCode: this.constructor.statusCode, message: 'Your comment should have an Id'};
                }
                this.id = id
            }

            setComment(comment, source){
                if(!source){
                    throw {statusCode: this.constructor.statusCode, message: 'Comment should have a source'};
                }
                if(source.constructor !== Object){
                    throw {statusCode: this.constructor.statusCode, message: `Source should be of type 'Object' but ${typeof source} given`};
                }
                if(!comment) {
                    throw {statusCode: this.constructor.statusCode, message: 'Comment should have content'};
                }
                if(sanitize(comment).trim().length < 1){
                    throw {statusCode: this.constructor.statusCode, message: 'Comment should have a valid content'};
                }
                this.comment = comment;
                this.edited = true;
                this.editedOn = Date.now();
                this.editedSource = makeSource(source);
            }

            deleteComment(source) {
                this.comment = null;
                this.ownerId = null;
                this.deleted = true;
                this.fullName = null;
                this.deleteType = 'hard_delete';
                this.deletedOn = Date.now();
                this.deleteSource = makeSource(source);
            }
        }
        return new Comment
    }
};