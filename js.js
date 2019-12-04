function buildCart() {
    $('#cart').empty();    //очищает блок корзины
    $.ajax({
        url: 'http://localhost:3000/cart',
        dataType: 'json',
        success: function (cart) {
            var $ul = $('<ul />');
            var amount = 0;

            cart.forEach(function (item) {
                var $li = $('<li />', {
                    text: item.name + '(' + item.quantity + ')'
                });
                var $button = $('<button />', {
                    text: 'x',
                    class: 'delete',
                    'data-id': item.id,
                    'data-quantity': item.quantity
                });

                amount += +item.quantity * +item.price;
                $li.append($button);
                $ul.append($li);
            });
            $('#cart').append($ul);
            $('#cart').append('Всего' + amount + 'руб.')
        }
    })
}

function buildGoodsList() {
    $.ajax({
        url: 'http://localhost:3000/goods',
        dataType: 'json',
        success: function (cart) {
            var $ul = $('<ul />');


            cart.forEach(function (item) {
                var $li = $('<li />', {
                    text: item.name + ' ' + item.price + 'руб.'
                });
                var $button = $('<button />', {
                    text: 'Купить',
                    class: 'buy',
                    'data-id': item.id,
                    'data-name': item.name,
                    'data-price': item.price
                });
                $li.append($button);
                $ul.append($li);
            });
            $('#goods').append($ul);
        }
    })
}

(function ($) {

    $(function () {
        buildCart();
        buildGoodsList();

        $('#cart').on('click', '.delete', function () {
            var id = $(this).attr('data-id');
            $.ajax({
                url: 'http://localhost:3000/cart/' + id,
                type: 'DELETE',
                success: function () {
                    buildCart();
                }
            })
        });

        $('#goods').on('click', '.bay', function () {
            var id = $(this).attr('data-id');
            var entity = $('#cart [data-id="' + id + '"]');
            if(entity.length) {
                $.ajax({
                    url: 'http://localhost:3000/cart/' + id,
                    type: 'PATCH',
                    headers: {
                        'content-type': 'application/json'
                    },
                    data: JSON.stringify({
                        quantity: +$(entity).attr('data-quantity') + 1
                    }),
                    success: function () {
                        buildCart();
                    }
                })
            } else {
                $.ajax({
                    url: 'http://localhost:3000/cart',
                    type: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    data: JSON.stringify({
                        id: id,
                        quantity: 1,
                        name: $(this).attr('data-name'),
                        price: $(this).attr('data-price')
                    }),
                    success: function () {
                        buildCart();
                    }
                })
            }
        });
    });
})(jQuery);
