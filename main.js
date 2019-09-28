var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
        }
    },
    template:`
        <div class="product">
            <div class="product-image">
                <img :src="image" alt="">
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In stock</p>
                <p v-else>Out of stock</p>
                <p>Shipping: {{ shipping }}</p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants" 
                     :key="variant.variantId"
                     class="color-box"
                     :style="{ backgroundColor: variant.variantColor }"
                     @mouseover="updateVariant(index)"  >
                </div>

                <button v-on:click="addToCart" 
                        :disabled="!inStock" 
                        :class="{disabledButton: !inStock}">
                        Add to Cart
                </button>
            </div>
            <product-tab :reviews="reviews"></product-tab>
        </div>
    `,
    data(){
        return  {
            product: 'Socks',
            brand: 'Vue',
            selectedVariant: 0,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 1,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 50
                },
                {
                    variantId: 2,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateVariant(index) { 
            this.selectedVariant = index
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            return (this.premium) ? 'Free' : 2.99;
        }
    },
    mounted() {
        eventBus.$on('review-submitted', data => {
            this.reviews.push(data)
        })
    }
})

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review" placeholder="review"></textarea>
            </p>
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </p>
            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } 
            else {
                if (!this.name) this.errors.push('Name required.')
                if (!this.review) this.errors.push('Review required.')
                if (!this.rating) this.errors.push('Rating required.')
            }
        }
    }
})

Vue.component('product-tab', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                v-for="(tab, index) in tabs" :key=index
                :class="{activeTab: selectedTab === tab}"
                @click="selectedTab = tab"
            >{{ tab }}</span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews left</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Raging: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>
            <div v-show="selectedTab === 'Make a review'">
                <product-review></product-review>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a review'],
            selectedTab: 'Reviews'
            // @review-submitted="addReview"
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        }
    }
})