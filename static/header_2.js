$(function () {
    //header 菜单
    var $menuBtn = $('#header-menu-btn'),
        $headerNav = $('#header-nav');

    $menuBtn.on('click', function (e) {
        e.stopPropagation();
        $headerNav.toggle();
    });

    $(document).on('click', function () {
        if (!$menuBtn.is(':hidden') && !$(this).is('#header-nav')) {
            $headerNav.hide();
        }
    });
});