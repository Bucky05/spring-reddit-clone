import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PostModel } from 'src/app/shared/PostModel';
import { throwError } from 'rxjs';
import { CommentPayload } from 'src/app/comment/CommentPayload';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {CommentService} from '../../comment/comment.service'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId: string;
  post: PostModel;
  commentForm : FormGroup
  commentPayload: CommentPayload
  comments : CommentPayload[]

  constructor(private toastr: ToastrService, private postService: PostService, private activateRoute: ActivatedRoute, private commentService: CommentService, private rouer: Router) {
    this.postId = this.activateRoute.snapshot.params['id'];
    this.commentForm = new FormGroup({
      text : new FormControl('',Validators.required)
    })
    this.commentPayload = {
      text : '',
      postId : this.postId
    }
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      this.toastr.error(error);
      throwError(error);
    });
  }

  ngOnInit(): void {
    this.getPostById()
    this.getCommentsForPost()
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text').value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text').setValue('')
      this.getCommentsForPost()
    }, error => {
      this.toastr.error(error.error.text);
      throwError(error)
    })
  }

  getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data
    }, error => {
        throwError(error);
      });
  }
  getPostById() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error)
    })
  }
}