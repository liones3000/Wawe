$(function () {
  var mixer = mixitup('.gallery__images');

  $('.blog__slider').slick({
    arrows: false,
    dots: true,
  });

  $('.contact__form').on('submit', (e) => e.preventDefault());

  // Scroll
  $('.menu__item-link').on('click', function (event) {
    event.preventDefault();
    var id = $(this).attr('href'),
      top = $(id).offset().top;

    $('body,html').animate({ scrollTop: top }, 1500);
  });

  // Change color on scroll
  $(window).scroll(function () {
    if ($(this).scrollTop() > 150) {
      $('.menu').css('color', '#01353e');
      $('.fixed-wrapper').css('background-color', '#fff');
      $('.header__menu-logo path, .header__btn path').css('fill', '#01353e');
    } else {
      $('.menu').css('color', '#fff');
      $('.fixed-wrapper').css('background-color', 'transparent');
      $('.header__menu-logo path, .header__btn path').css('fill', '#fff');
    }
  });

  // Menu button
  $('.header__btn, .menu__item-link').on('click', (e) => {
    $('.header .menu').toggleClass('menu--active');
  });
});
