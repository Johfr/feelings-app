<script setup lang="ts">

</script>

<template>
  <section class="section">
    <div class="block left-block">
      <h2>Rendre les sites et services numériques accessibles à toutes et à tous</h2>
      <p>
        L'accessibilité numérique consiste à rendre les contenus et services numériques compréhensibles et utilisables par les personnes en situation de handicap.
      </p>
    </div>

    <div class="block right-block">
      <img src="https://cdn-icons-png.flaticon.com/512/7118/7118029.png" alt="">
    </div>
  </section>
</template>

<style lang="scss" scoped>
.section {
  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    gap: var(--gap-16);
    margin-top: 50px;
    margin-bottom: 50px;
  }
}

@media (min-width: 1024px) {
  .block {
    width: 100%;
    max-width: 50%;
  }
}

h2 {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  @media (min-width: 1024px) {
    font-size: 42px;
  }
}

p {
  margin-top: 50px;
  margin-bottom: 50px;
  color: #9f9f9f;
}

img {
  width: 250px;
  display: block;
  margin: 0 auto;
}
</style>