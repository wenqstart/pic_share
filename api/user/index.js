import $http from '../requset'

// 注册接口
export const reqRegister = (registerInfo) => $http.post('/member/photo/user/register', registerInfo)

// 登录接口
export const reqLogin = (loginInfo) => $http.post(
	`/member/photo/user/login?password=${loginInfo.password}&username=${loginInfo.username}`)

// 修改信息
// avatar,id,introduce,sex,username
export const reqUpdate = (userInfo) => {
	console.log(userInfo);
	const avatar = userInfo.avatar ? userInfo.avatar : undefined
	const introduce = userInfo.introduce ? userInfo.introduce : undefined
	const sex = userInfo.sex
	const username = userInfo.username ? userInfo.username : undefined
	const id = userInfo.id ? userInfo.id : undefined
	console.log(avatar, introduce, sex, username, id);
	return $http.post('/member/photo/user/update', {
		avatar,
		introduce,
		sex,
		username,
		id
	})
}

// 获取全部图片列表
export const reqGetPicList = (newObj) => $http.get(
	`/member/photo/share?current=${newObj.current}&size=${newObj.size}&userId=${newObj.id}`)

//获取单个图片分享详情
export const reqPicDetail = ({
	userId,
	shareId
}) => $http.get(`/member/photo/share/detail?shareId=${shareId}&userId=${userId}`)

//新增图文分享
export const reqAddPicShare = ({
	content,
	imageCode,
	pUserId,
	title
}) => $http.post(`/member/photo/share/add`, {
	content,
	imageCode,
	pUserId,
	title
})

//保存图文分享
export const reqSavePicShare = ({
	content,
	imageCode,
	pUserId,
	title
}) => $http.post(`/member/photo/share/save`, {
	content,
	imageCode,
	pUserId,
	title
})

// 删除图文分享
export const reqDeletePicShare = ({
	userId,
	shareId
}) => $http.post(`/member/photo/share/delete?shareId=${shareId}&userId=${userId}`)

//获取已发布的图片分享列表
export const reqMySharePicList = (newObj) => $http.get(
	`/member/photo/share/myself?current=${newObj.current}&size=${newObj.size}&userId=${newObj.id}`)

// 获取已保存的图文分享列表
export const reqMySavePicList = (newObj) => $http.get(
	`/member/photo/share/save?current=${newObj.current}&size=${newObj.size}&userId=${newObj.id}`)

// 将保存状态修改为发布状态
export const reqChangeStatus = ({
	content,
	id,
	imageCode,
	pUserId,
	title
}) => {
	console.log({
		content,
		id,
		imageCode,
		pUserId,
		title
	});
	return $http.post(`/member/photo/share/change`, {
		content,
		id,
		imageCode,
		pUserId,
		title
	})
}

//获取当前登录用户收藏图文列表
export const reqGetPicCollectionList = (newObj) => $http.get(
	`/member/photo/collect?current=${newObj.current}&size=${newObj.size}&userId=${newObj.id}`)

//获取当前登录用户点赞图文列表
export const reqGetLikeList = (newObj) => $http.get(
	`/member/photo/like?current=${newObj.current}&size=${newObj.size}&userId=${newObj.id}`)

//获取当前登录用户关注图文列表
export const reqGetFocusList = (newObj) => $http.get(
	`/member/photo/focus?current=${newObj.current}&size=${newObj.size}&userId=${newObj.id}`)

//对图文进行收藏
export const reqCollectPic = ({
	shareId,
	userId
}) => $http.post(`/member/photo/collect?shareId=${shareId}&userId=${userId}`, {})

//对图文取消收藏
export const reqCancelCollect = ({
	collectId
}) => $http.post(`/member/photo/collect/cancel?collectId=${collectId}`, {})

//对图文进行点赞
export const reqLikePic = ({
	shareId,
	userId
}) => $http.post(`/member/photo/like?shareId=${shareId}&userId=${userId}`, {})

//对图文取消点赞
export const reqCancelLike = ({
	likeId
}) => $http.post(`/member/photo/like/cancel?likeId=${likeId}`, {})

// 关注用户
export const reqFocusUser = (infoObj) => $http.post(
	`/member/photo/focus?focusUserId=${infoObj.focusUserId}&userId=${infoObj.userId}`)

// 取消关注用户
export const reqCancelFocus = (infoObj) => $http.post(
	`/member/photo/focus/cancel?focusUserId=${infoObj.focusUserId}&userId=${infoObj.userId}`)

// 获取一级评论
export const reqGetFirstComment = (shareInfo) => $http.get(
	`/member/photo/comment/first?shareId=${shareInfo.shareId}&current=${shareInfo.current}&size=${shareInfo.size}`)

// 获取二级评论
export const reqGetSecondComment = (shareInfo) => $http.get(
	`/member/photo/comment/second?shareId=${shareInfo.shareId}&commentId=${shareInfo.commentId}`)

// 新增一级评论
export const reqAddFirstComment = (shareInfo) => {
	console.log(shareInfo);
	const {
		content,
		shareId,
		userId,
		userName
	} = shareInfo;
	return $http.post(`/member/photo/comment/first`, {
		content,
		shareId,
		userId,
		userName
	})
}

// 新增二级评论
export const reqAddSecondComment = (shareInfo) => {
	console.log(shareInfo);
	const {
		content,
		parentCommentId,
		parentCommentUserId,
		replyCommentId,
		replyCommentUserId,
		shareId,
		userId,
		userName
	} = shareInfo;
	return $http.post(`/member/photo/comment/second`, {
		content,
		parentCommentId,
		parentCommentUserId,
		replyCommentId,
		replyCommentUserId,
		shareId,
		userId,
		userName
	})
}
