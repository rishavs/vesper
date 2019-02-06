import Utils        from './../../services/Utils.js'

import LikePost     from '../components/LikePost.js' 
import TagsList     from '../components/TagsList.js' 
import PostContent  from '../components/PostContent.js' 
import PostEdit     from '../components/PostEdit.js' 

import Error404     from './Error404.js'
import CommentsTree from '../components/CommentsTree.js';


let getPost = async (post_id) => {
    const payload = {
        "post_id": post_id,
    }

    const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    };
   try {
       const response = await fetch(`http://localhost:3000/get_post_details_for_anon`, options)
    //    console.log(response)
       const json = await response.json();
       console.log(json)
       return json
   } catch (err) {
       console.log('Error getting documents', err)
   }
}

let changePost = async (post_id, title, link, content) => {
    const payload = {
        "post_id"       : post_id,
        "new_title"     : title,
        "new_link"      : link,
        "new_content"   : content,
    }

    const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    };
   try {
       const response = await fetch(`http://localhost:3000/update_post`, options)
       const json = await response.json();
       console.log(json)
       return json
   } catch (err) {
       console.log('Error getting documents', err)
   }
}

let likePost = async (post_id) => {
    const payload = {
        "post_id": post_id,
    }

    const options = {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    };
   try {
       const response = await fetch(`http://localhost:3000/like_post`, options)
       const json = await response.json();
       console.log(json)
       return json
   } catch (err) {
       console.log('Error getting documents', err)
   }
}

let read_post_view = async (post) => /*html*/`                
    <h3 class="title is-3" id="post_title_label">${post.title}</h3>
    by <strong>${post.user_nick}</strong> 
    <i class="far fa-clock"></i>
    <small>31m ago</small>
    <br>
    <br>
    <p style="">
    <figure  >
        <p class="image is-128x128">
        <img src="http://via.placeholder.com/256x256">
        </p>
    </figure>
    ${post.content}
    </p>
`

let edit_post_view = async (post) => /*html*/`                
    <article id="edit_post_container" >
        <div class="field">
            <label class="label">Title</label>
            <p class="control has-icons-left has-icons-right">
                <input class="input" id="post_edit_title_input" type="text" placeholder="Enter your Title of your Post" value="${post.title}">
                <span class="icon is-small is-left">
                    <i class="fas fa-envelope"></i>
                </span>
                <span class="icon is-small is-right">
                    <i class="fas fa-check"></i>
                </span>
            </p>
            <p class="help is-danger">This email is invalid</p>
        </div>

        <div class="field">
            <label class="label">Link (Optional)</label>
            <p class="control has-icons-left">
                <input class="input" id="post_edit_link_input" type="text" placeholder="Enter the link to a website that you are posting about" value="${post.link}">
                <span class="icon is-small is-left">
                    <i class="fas fa-lock"></i>
                </span>
            </p>
            <p class="help is-danger">This email is invalid</p>
        </div>

        <div class="field">
            <label class="label">Content</label>
            <textarea class="textarea" id="post_edit_content_input" placeholder="Enter a Content of your Post" >${post.content}</textarea>
            <p class="help is-danger">This email is invalid</p>
        </div>
    </article>
`

let PostShow = {
    onlyAllow: 'all',
    state: {},
    load: async function () {},
    render : async function () {
        let request = Utils.parseRequestURL()
        this.state = await getPost(request.id)

        if (this.state.status == "success") {
            return /*html*/`
                <section class="section pageEntry">
                    <div id="error_flash" class="notification is-danger is-hidden" ></div>
                    <div id="post_container">
                        ${ await read_post_view(this.state.data)} 
                    </div>
                    <hr>
                    <nav class="level is-mobile">
                        <div class="level">
                            <a class="level-item" id="post_like_btn" data-visible-to="${this.state.data.user_id}">
                                <span class="icon is-small"><i class="far fa-heart"></i></span>
                                &nbsp Like &nbsp
                            </a>
                            <a class="level-item" id="post_reply_toggle_btn">
                                <span class="icon is-small"><i class="far fa-comment-alt"></i></span>
                                &nbsp Reply &nbsp
                            </a>
                            <a class="level-item" id="post_reply_toggle_btn" data-visible-to="${this.state.data.user_id}">
                                <span class="icon is-small"><i class="far fa-bookmark"></i></span>
                                &nbsp Bookmark &nbsp
                            </a>

                            <a class="level-item is-hidden" id="post_edit_btn" data-visible-to="${this.state.data.user_id}">
                                <span class="icon is-small"><i class="fas fa-edit"></i></span>
                                &nbsp EDIT &nbsp
                            </a>
                            <a class="level-item is-hidden" id="post_edit_submit_btn" >
                                <span class="icon is-small"><i class="fas fa-edit"></i></span>
                                &nbsp Submit &nbsp
                            </a>
                            <a class="level-item is-hidden" id="post_edit_cancel_btn" >
                                <span class="icon is-small"><i class="fas fa-edit"></i></span>
                                &nbsp Cancel &nbsp
                            </a>
                            <a class="level-item is-hidden" id="post_delete_btn" data-visible-to="${this.state.data.user_id}">
                                <span class="icon is-small"><i class="far fa-trash-alt"></i></span>
                                &nbsp Delete &nbsp
                            </a>
                        </div>
                    </nav>
                    <hr>
                    <article class="media">
                        <div class="media-content">
                        ${await TagsList.render(this.state.data.tags)}
                        </div>
                    </article>
                    </br>
    

                    ${ await CommentsTree.load(request.id)}
                    ${ await CommentsTree.render()}

                </section>
            `
        } else if (this.state.status == "404" ){
            return Error404.render()
        } else {
            console.log(this.state)
        }
        

    },
    control: async function () {
        // Default visibility of elements for the current user
        let current_user_id = window.localStorage['_user_id']
        document.querySelectorAll('[data-visible-to="' + CSS.escape(current_user_id) + '"]').forEach(node => {
            node.classList.toggle('is-hidden')
        })

        document.getElementById("post_like_btn").addEventListener('click', async (e) => {
            // ensure user is logged in to use this action
                // utils.redirect_to_login_if_not_loggedin()
            let request = Utils.parseRequestURL()
            let result = await likePost(request.id)
            if (result.status == 'success') {
                console.log(`Update Succeeded: ${result}`)
                // window.location.hash = `/p/${result.data.unqid}`
            } else {
                console.log(`Update Failed: ${result.errorMessage}`)
                flash.classList.toggle('is-hidden')
                flash.innerText = `${result.message}`
                flash.scrollIntoView({behavior: 'smooth'})
            }
        })
        document.getElementById("post_reply_toggle_btn").addEventListener('click', async (e) => {
            // ensure user is logged in to use this action
                // utils.redirect_to_login_if_not_loggedin()

            let component = document.getElementById('post_comment_field')
            component.classList.toggle('is-hidden')
            // this bit is mainly for a smoother transition. Broken in chrome
            document.getElementById('post_comment_field').scrollIntoView({ behavior: 'smooth' })
            document.getElementById('post_comment_field').focus();
        })

        document.getElementById("post_edit_btn").addEventListener('click', async (e) => {
            console.log("Edit was clicked")
            document.getElementById("post_container").innerHTML = await edit_post_view(this.state.data)
            let e1 = document.getElementById('post_edit_title_input')
            if (e1){
                // e1.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                // e1.focus;
            } 
            document.getElementById("post_edit_btn").classList.toggle('is-hidden')
            document.getElementById("post_edit_submit_btn").classList.toggle('is-hidden')
            document.getElementById("post_edit_cancel_btn").classList.toggle('is-hidden')

        })

        document.getElementById("post_edit_submit_btn").addEventListener("click", async (e) => {
            this.state.data.title     = document.getElementById("post_edit_title_input").value
            this.state.data.link      = document.getElementById("post_edit_link_input").value
            this.state.data.content   = document.getElementById("post_edit_content_input").value
            // Now set these updated values in the state
            // this.state.data.

            // and rerender the read post view
            document.getElementById("post_container").innerHTML = await read_post_view(this.state.data)

            // and fire the api call to update the same in the db
            let result = await changePost(Utils.parseRequestURL().id, this.state.data.title, this.state.data.link, this.state.data.content)
            if (result.status == 'success') {
                console.log(`Update Succeeded: ${result}`)
                // window.location.hash = `/p/${result.data.unqid}`
            } else {
                console.log(`Update Failed: ${result.errorMessage}`)
                flash.classList.toggle('is-hidden')
                flash.innerText = `${result.message}`
                flash.scrollIntoView({behavior: 'smooth'})
            }
        })

        document.getElementById("post_edit_cancel_btn").addEventListener('click', async (e) => {
            document.getElementById("post_container").innerHTML = await read_post_view(this.state.data)
            document.getElementById("post_edit_btn").classList.toggle('is-hidden')
            document.getElementById("post_edit_submit_btn").classList.toggle('is-hidden')
            document.getElementById("post_edit_cancel_btn").classList.toggle('is-hidden')

        })

        // await PostContent.control()
        // await LikePost.control()
        await TagsList.control()
        await CommentsTree.control()

    }
}

export default PostShow;