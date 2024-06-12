<template>
	<view class="content">
    <div class="bg-img"></div>
		<!-- <image class="bg-img" src="/static/bg.png"></image> -->
		<view class="imgcontent" :style="{ marginTop: imgContentTop}">
			<view class="tips">{{tips}}</view>
			
			<view class="banner_select" v-if="img == ''" @click="choosePhoto">
        <div class="img"></div>
			    <!-- <image class="img" src="/static/upload.png"></image> -->
			</view>
			
			<view class="banner" v-if="img != ''">
			    <image class="img" :src="img"></image>
				<image class="banner-img" :src="maskImg" :style="{ top: bannerImgTop}"></image>
			</view>
			
			<view class="template">
				<image class="arrow_left" src="../assets/static/arrow-left-bold.png" @click="prevSwiper"></image>
				<view class="uni-margin-wrap">
					<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
						:duration="duration" @change="picChange" :current="currentIndex" :display-multiple-items="showNum">
						<swiper-item v-for="(item, index) in picStyleList" :key="item.id">
							<view class="swiper-item">
								<image :src="item.img" mode="aspectFill" @click="selectTemplate(index)" :class="{'active':isActive==index}"></image>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<image class="arrow_right" src="../assets/static/arrow-right-bold.png" @click="nextSwiper"></image>
			</view>
		</view>
		
		<view class="gen-button" @click="genpic">
			<image src="../assets/static/gen_button.png"></image>
		</view>
	</view>
</template>

<script>
	// import { getGqTemplateList, uploadImg, genGuoqingPic } from "../../service/img/pic.js";
	// import { pathToBase64 } from 'image-tools'
	// import { getHeight } from "../../utils/common.js";
	export default {
		data() {
			return {
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				currentIndex: 0,
				picStyleList: [],
				token: 'ykXEpBOldDYJJUfZO84i',
				showNum: 3,
				scrollLeft: 0,
				isActive: 0,
				maskImg: '',
				tips: '',
				img: 'https://bzimg.rycalendar.cn/userpic/2023-09-09/953c5322580284ce55ba7734bccfdf07.png',
				base64: '',
				remoteUrl: '',
				bannerImgTop: '376px',
				imgContentTop: '180px',
			}
		},
		onLoad(option) {
			this.getGqTemplateList()
			// this.bannerImgTop = getHeight('376px')
			// this.imgContentTop = getHeight('180px')
		},
		methods: {
			async getGqTemplateList() {
				let params = {
					'token': this.token
				}
				let response = await getGqTemplateList(params);
				console.log('response', response)
				if (response.code == 200) {
					this.picStyleList = response.data.list
					this.tips = '已有' + response.data.genNum + '人生成国庆图像'
					this.getMaskImg()
				}
			},
			prevSwiper() { 
				let current = this.currentIndex
				let ncurrent = current > 0 ? current - 1 : this.picStyleList.length - 1;
				this.currentIndex = ncurrent
				this.isActive = ncurrent 
				this.getMaskImg()
				console.log('prevSwiper', this.currentIndex)
			},
			// 下一页
			nextSwiper() {
				let current = this.currentIndex
				let ncurrent = current < (this.picStyleList.length - 1) ? current + 1 : 0;
				this.currentIndex = ncurrent
				this.isActive = ncurrent
				this.getMaskImg()
				console.log('nextSwiper', this.currentIndex)
			},
			picChange(e) {
				this.currentIndex = e.detail.current
				this.isActive = e.detail.current
				this.getMaskImg()
			},
			selectTemplate(index) {
				this.isActive = index
				this.currentIndex = index
				this.getMaskImg()
				if (this.img == '') {
					uni.showToast({
						title: '请上传图片',
						duration: 1000,
						icon: 'error'
					});
				}
				console.log('选中了', index)
			},
			getMaskImg() {
				this.maskImg = this.picStyleList[this.currentIndex]['img']
			},
			choosePhoto() {
				let that = this
				uni.chooseImage({
					count: 6, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					crop: {'width': 600, 'height': 600, 'quality': 100},
					success: function (res) {
						pathToBase64(res.tempFilePaths[0]).then(base64 => {
							that.base64 = base64
							that.uploadImg()
						}).catch(error => {
						  console.log('转换失败：', error);
						})
					}
				})
			},
			async uploadImg() {
				let params = {
					'token': this.token,
					'base64': this.base64
				}
				let response = await uploadImg(params);
				console.log('response', response)
				if (response.code != 200) {
					uni.showToast({
						title: '上传图片失败',
						duration: 1000,
						icon: 'error'
					});
					return
				}
				this.img = response.data
			},
			async genpic() {
				uni.showLoading({
					'title': '图片正在合成中，请稍后~'
				});
				if (this.img == '') {
					uni.showToast({
						title: '请上传图片',
						duration: 1000,
						icon: 'error'
					});
					return
				}
				let params = {
					'token': this.token,
					'bgimg': this.img,
					'maskimg': this.picStyleList[this.currentIndex]['img'],
					'openid': uni.getStorageSync('openid')
				}
				let response = await genGuoqingPic(params);
				uni.hideLoading()
				if (response.code != 200) {
					uni.showToast({
						title: '网络异常，请稍后重试~',
						duration: 1000,
						icon: 'error'
					});
					return
				}
				this.remoteUrl = response.data
			}
		}
	}
</script>

<style scoped>
.content {
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	/* height: 100%; */
	/* overflow-y: hidden; */
/* 	background-image: url('../../static/bg.png');
	background-size: cover; */
	/* background-position: center; */
	z-index: -99;
}
.bg-img {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
	z-index: -99;
  background-color: pink;
}
.imgcontent {
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
	height: 720px;
	width: 100%;
/* 	margin-top: 180px; */
	border: 1px solid blue;
}
.tips {
	color: white;
	font-size: 14px;
	font-weight: 400;
	margin-top: 36px;
}
.banner_select {
	width: 430px;
	height: 430px;
	margin-top: 26px;
	display: flex;
	justify-content: center;
	align-items: center;
	/* border: 1px solid red; */
}
.banner_select image {
	width: 150px;
	height: 213px;
  background-color: aquamarine;
}
.banner {
	width: 430px;
	height: 430px;
	margin-top: 26px;
	border: 1px solid red;
}
.banner .img {
	width: 430px;
	height: 430px;
}
.banner .banner-img {
  width: 430px;
  height: 430px;
  position: fixed;
  left: 160px;
}
.template {
	display: flex;
	flex-direction: row;
	align-content: space-between;
	align-items: center;
	height: 140px;
	width: 100%;
	padding: 10px 60px 10px 60px;
	margin-top: 20px;
}
.uni-margin-wrap {
	height: 140px;
	width: 100%;
}
.swiper {
	height: 140px;
}
.swiper-item {
	display: block;
	height: 140px;
	line-height: 140px;
	text-align: center;
}

.swiper-item image{
	width: 140px;
	height: 140px;
	border-radius: 4px;
}

.arrow_left {
	width: 64px;
	height: 64px;
}
.arrow_right {
	width: 64px;
	height: 64px;
}
.active {
	border: 3px solid #ffa871;
	border-radius: 4px;
}
.gen-button {
	text-align: center;
	margin-top: 80px;
	width: 100%;
}
.gen-button image {
	width: 400px;
	height: 150px;
}
</style>
