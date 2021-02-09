<template>
<div style="with:100%">

  <!-- Header -->
  <header class="masthead d-flex">
    <div class="container my-auto" style="max-width:100%">
      <h1 class="mb-1 text-center">{{$t('sharecafe')}}</h1>
      <h3 class="mb-5 text-center">
        <em>{{ $t('solgan') }}</em>
      </h3>
      <div class="col-md-10 col-lg-8 col-xl-7 mx-auto">
        <form @submit="search">
            <div class="form-row justify-center">
              <div class="col-12 col-md-9 my-auto">
                <address-input :auto-focus="true" @input="changeAddress" />
              </div>
              <div class="col-12 col-md-3 my-auto">
                <v-btn @click="search()" class="btn btn-block btn-lg btn-primary" >{{$t('start')}}</v-btn>
              </div>
            </div>
        </form>
        </div>
    </div>
    <div class="overlay"></div>
  </header>

  <!-- About -->
  <section class="content-section bg-light" id="about">
    <div class="container">
      <div class="row">
        <div class="col-lg-5 mb-4 text-center">
          <img width="400" height="300" src="https://res.cloudinary.com/pegah/image/upload/q_auto,f_jpg/v1609248888/Grandmas.png">
        </div>
        <div class="col-lg-7">
          <h2>{{$t('goal_title')}}</h2>
          <p class="lead mb-2">{{$t('goal')}}</p>
          <!--<a class="btn btn-dark btn-xl js-scroll-trigger" href="#services">What We Offer</a>-->
        </div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="content-section bg-primary text-white text-center" id="services">
    <div class="container">
      <div class="content-section-heading">
        <h3 class="text-secondary mb-0">Services</h3>
        <h2 class="mb-5">Was wir bieten</h2>
      </div>
      <div class="row">
        <div class="col-lg-3 col-md-6 mb-5 mb-lg-0">
          <span class="service-icon rounded-circle mx-auto mb-3">
            <fa icon="money-bill-wave" />
          </span>
          <h4>
            <strong>Geld Verdienen</strong>
          </h4>
          <p class="text-faded mb-0">Erstell eine neue Angebot!</p>
        </div>
        <div class="col-lg-3 col-md-6 mb-5 mb-lg-0">
          <span class="service-icon rounded-circle mx-auto mb-3">
            <fa icon="drumstick-bite" />
          </span>
          <h4>
            <strong>Essen Finden</strong>
          </h4>
          <p class="text-faded mb-0">Such in die Angebote</p>
        </div>
        <div class="col-lg-3 col-md-6 mb-5 mb-md-0">
          <span class="service-icon rounded-circle mx-auto mb-3">
            <fa icon="heart" />
          </span>
          <h4>
            <strong>Essen Schenken</strong>
          </h4>
          <p class="text-faded mb-0">Schenck was du über hast
            <fa icon="heart" /></p>
        </div>
        <div class="col-lg-3 col-md-6">
          <span class="service-icon rounded-circle mx-auto mb-3">
            <fa icon="glass-cheers" />
          </span>
          <h4>
            <strong>Party</strong>
          </h4>
          <p class="text-faded mb-0">du kannst ein Essen event machen</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Portfolio -->
  <section class="content-section" id="portfolio">
    <div class="container">
      <div class="content-section-heading text-center">
        <h2 class="mb-5">{{$t('gallery_title')}}</h2>
      </div>
      <div class="row justify-content-center">
        <div class="row w-50 justify-content-center flex-wrap">      
          <div v-for="item in Invites" :key="item.description">
            <a class="portfolio-item" href="#">
              <span class="caption">
                <span class="caption-content">
                  <h2>{{item.User.name}}</h2>
                  <p class="mb-0">{{item.description}}</p>
                </span>
              </span>
              <img class="img-fluid" :src="squarePhoto(item.photoUrl)" alt="">
            </a>
          </div>   
        </div>
      </div>
    </div>
  </section>

  <!-- Call to Action -->
  <section class="content-section bg-primary text-white">
    <div class="container text-center">
      <h2 class="mb-4">{{$t('aboutus')}}</h2>
      <div class="row">

   <!--Grid column-->
   <div class="col-lg-3 col-md-12 mb-4"></div>
   <div class="col-lg-3 col-md-12 mb-4">

     <!--Card-->
     <div class="card testimonial-card">
      <div class="card-up deep-purple lighten-2"></div>
       <!--Avatar-->
       <div class="avatar mx-auto white"><img width="160" height="160" src="https://res.cloudinary.com/pegah/image/upload/w_200,h_200,c_fill,g_face,r_max,q_auto/v1609247393/Doris.jpg"
           alt="mx-auto white" class="img-fluid rounded-circle">
       </div>

       <div class="card-body" style="color: #000000">
         <!--Name-->
         <h4 class="card-title mt-1">Doris Grüber</h4>
         <hr>
         <!--Quotation-->
         <p><fa icon="quote-left" />{{$t('doris')}}</p>
       </div>

     </div>
     <!--Card-->

   </div>
   <!--Grid column-->

   <!--Grid column-->
   <div class="col-lg-3 col-md-12 mb-4">
     <!--Card-->
     <div class="card testimonial-card">

      <div class="card-up blue lighten-2"></div>
       <!--Avatar-->
       <div class="avatar mx-auto white"><img width="160" height="160" src="https://res.cloudinary.com/pegah/image/upload/w_200,h_200,c_fill,g_face,r_max,q_auto/v1609247393/Pegah.jpg"
           alt="mx-auto white" class="img-fluid rounded-circle">
       </div>

       <div class="card-body" style="color: #000000">
         <!--Name-->
         <h4 class="card-title mt-1">Pegah Safaie</h4>
         <hr>
         <!--Quotation-->
         <p><fa icon="quote-left" />{{$t('pegah')}}</p>
       </div>

     </div>
     <!--Card-->

   </div>
   <div class="col-lg-3 col-md-12 mb-4"></div>
   <!--Grid column-->

 </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer text-center">
    <div class="container">
      <ul class="list-inline mb-5">
        <li class="list-inline-item">
          <a class="social-link rounded-circle text-white mr-3" href="#">
            <i class="icon-social-facebook"></i>
          </a>
        </li>
        <li class="list-inline-item">
          <a class="social-link rounded-circle text-white mr-3" href="#">
            <i class="icon-social-twitter"></i>
          </a>
        </li>
        <li class="list-inline-item">
          <a class="social-link rounded-circle text-white" href="#">
            <i class="icon-social-github"></i>
          </a>
        </li>
      </ul>
      <p class="text-muted small mb-0">Copyright &copy; Your Website 2019</p>
    </div>
  </footer>

  <!-- Scroll to Top Button-->
  <a class="scroll-to-top rounded js-scroll-trigger" href="#page-top">
    <fa icon="angle-up" />
  </a>

  <v-snackbar v-model="snackbar" :timeout="timeout">
    {{toast}}
    <v-btn dark text @click="snackbar = false">
      Close
    </v-btn>
  </v-snackbar>
</div>
</template>

<script>

import getInvites from '../apollo/queries/getInvites';
export default ({
  data: () => {
    return {
      snackbar: false,
      timeout: 6000,
      toast: '',
      context: {},
      Invites: [],
    }
  },
  middleware: 'showLogin',
  // you can also do the query like this I think, using the Nuxt asyncData hook:
  asyncData (context) {    
    const client = context.app.apolloProvider.defaultClient
    const query =  {
      query: getInvites, 
      variables: {
      last: 4
      }
    };
    return client.query(query)
      .then(({ data }) => {
      //  Nuxt.js will automatically merge the returned object with the component data
      return { Invites: data.Invites };
    })
  },
  /*apollo: {
    Invites: {
      query: getInvites,
      variables: {
        last: 4
      }
    }
  },*/
  methods: {
    search: function () {
      this.$router.push({
        path: '/Gallery', query: { ...this.context }
      })
    },
    changeAddress: function(addressObject) {
      this.context = addressObject;
    },
    squarePhoto(photoUrl) {
      return photoUrl.replace('/upload/', '/upload/w_250,ar_1:1,c_fill,g_auto/');
    }
  }
})
</script>
