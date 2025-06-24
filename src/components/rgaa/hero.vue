<script setup lang="ts">

</script>

<template>
  <section class="hero-section">
    <img src="../../assets/hero-bg.jpg" alt="image d'une ville illuminée en pleine nuit">
    <div class="container">
      <h1 id="title">Créer une solution numérique</h1>
      <p id="para" aria-labelledby="title">
        Solution de voyage d'affaires à votre prix
      </p>
      <button class="btn-half" aria-describedby="para">Nous écrire</button>
    </div>
  </section>

</template>

<style lang="scss" scoped>
.hero-section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  @media (min-width: 1024px) {
    flex-direction: row-reverse;
    margin-top: 65px;
    gap: var(--gap-32);
  }
}

img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  object-fit: cover;
  
  @media (min-width: 1024px) {
    max-width: 50%;
    // clip-path: polygon(20% 0, 100% 0, 100% 58%, 54% 104%, -12% 35%);
  }
}

.container {
  margin-top: 30px;
  margin-bottom: 30px;

  @media (min-width: 1024px) {
    margin-top: 100px;
    margin-bottom: 100px;
  }
}

h1 {
  font-size: 42px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1;
  
  @media (min-width: 1024px) {
    font-size: 72px;
  }
}

p {
  max-width: 80%;
  color: #9f9f9f;
  margin-top: 30px;
  margin-bottom: 30px;

  @media (min-width: 1024px) {
    max-width: 50%;
    margin-top: 15px;
    margin-bottom: 75px;
  }
}
</style>