{
    // method to submit the form data using ajax
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();
            
            $.ajax({
                type : 'post',
                url : '/posts/create',
                data : newPostForm.serialize(),
                success : function(data){
                    let newPost = new newPostDom(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                }, error : function(error){
                    console.log(error.reponseText);
                }
            })
        });

    }

    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/destroy/${ post._id }">delete</a>
            </small>
            ${ post.content }
            <br>
        <small>
            ${ post.user.name }
        </small>
        </p>
        <div class="post-comment">
                <form action="/comments/create" method="post">
                    <input type="text" name="comment" id="comment" placeholder="Comments ...." required>
                    <input type="hidden" name="post" value="${ post._id }">
                    <input type="submit" value="Add Comment">
                </form>

                <div class="post-comments-list">
                    <ul id="post-comments-${ post._id }">
                        
                    </ul>
                </div>
        </div>
        
    </li>`)
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            
            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success : function(data){
                    $(`$post-${data.data.post._id}`).remove();
                }, 
                error : function(err){
                    console.log(err);
                }
            })

        })
    }

    createPost();
}