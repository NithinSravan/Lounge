export interface Post{
  _id:string,
  content:string,
  imagePath:string,
  likes:number,
  likedBy:any[],
  creator:string,
  creatorname:string
}
