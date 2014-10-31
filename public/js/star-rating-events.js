$('.rating').on('rating.change', function(event, value, caption) {
    console.log(event.currentTarget,value);
    console.log(caption);
});