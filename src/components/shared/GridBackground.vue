<template>
  <div class="fixed inset-0 z-[-1] overflow-hidden pointer-events-none perspective-[1000px]">
    <div 
      class="absolute inset-x-[-50%] top-[-50%] h-[200%] w-[200%] bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [transform:rotateX(60deg)] animate-grid-travel"
    ></div>
    <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
  </div>
</template>

<style scoped>
@keyframes grid-travel {
  0% { transform: rotateX(60deg) translateY(0); }
  100% { transform: rotateX(60deg) translateY(50px); }
}
.animate-grid-travel {
  animation: grid-travel 2s linear infinite;
}
</style>
