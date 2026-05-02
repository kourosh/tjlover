$('.rating').on('rating.change', function(event, value, caption) {
        var productId = $('#product').data('id');
        if (!productId) {
            console.log('No product id available for rating post');
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/rating',
            data: { stars: value, product_id: productId },
            dataType: 'json'
        }).done(function(resp) {
            if (resp && resp.average !== undefined) {
                // update displayed rating to the new average
                $('.rating').rating('update', resp.average);
                console.log('Updated average rating:', resp.average);
            }
        }).fail(function(xhr) {
            if (xhr.status === 401) {
                window.location = '/login';
            } else {
                console.log('Error saving rating', xhr);
            }
        });
});