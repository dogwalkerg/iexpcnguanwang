$(function () {

    var $agreement = $('#agreement'),
        $email = $('#email'),
        $emailErr = $email.parent().find('.error'),
        $captchaErr = $('#captchaCodeErr'),
        $emailErrR = $emailErr.first(),
        $emailErrG = $emailErr.last(),
        $node3 = $('.node-3'),
        $nodeRequire = $('.node-require'),
        $agreementErr = $agreement.parent().find('.error');

    
    // 选择套餐
    $('#package').on('click','.product-item',function () {
        var $id = $(this).data('id');
        $(this).addClass('selected').parent().siblings().find('.product-item').removeClass('selected');
        $('#planNum').val($id);
    });

    // 选择节点
    $('#node').on('click','.connection',function () {
        var $this = $(this);
        var $selected = $this.parents('ul').find('.connection').filter('.selected');

        if ($this.hasClass('selected')) {
            $this.removeClass('selected').find('.cross-icon').remove();
            $node3.addClass('hidden');
        } else {
            $nodeRequire.addClass('hidden');
            if ($selected.length === 3) {
                $node3.removeClass('hidden');
            } else {
                $this.addClass('selected').find('.area-icon').append('<i class="cross-icon"></i>');
            }
        }

    });

    //更新验证码
    $('#refreshBtn').on('click', function () {
        var time = new Date().getTime();
        var $this = $(this);
        $.get('/site/captcha',{refresh:1,_:time},function (res) {
            $this.parent().find('img').attr('src',res.url);
        });
    });

    function checkEmail(email) {
        var reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        // var reg2 = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@q{2}(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        // var reg3 = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@f{1}o{1}x{1}m{1}a{1}i{1}l{1}(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var reg4 = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@i{1}c{1}l{1}o{1}u{1}d{1}(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	var reg5 = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@m{1}e{1}(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var reg6 = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@m{1}a{1}c{1}(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var reg7 = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@1{1}2{1}6{1}(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var reg8 = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@1{1}6{1}3{1}(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
	if (reg.test(email) && !reg4.test(email)  && !reg5.test(email) && !reg6.test(email) && !reg7.test(email) && !reg8.test(email)) {
            return true;
        }
        return false;
    }

    // 验证电邮
    $email.on('change focusout',function () {
        var $this = $(this),
            $val = $this.val().trim();

        if ($val) {
            $emailErrR.addClass('hidden');
            if (checkEmail($val)) {
                $emailErrG.addClass('hidden');
                $this.addClass('valid');
            } else {
                $emailErrG.removeClass('hidden');
                $this.removeClass('valid');
            }
        }

    });

    //验证码
    var captchaLock = true;
    $('.captcha-input').on('blur', function () {
       var $code = $(this).val().trim();
       if ($code) {
           $.ajax({
               url: '/site/valid-captcha',
               type: 'GET',
               async: false,
               data: {captcha: $code}
           }).done(function (data) {
               var res = JSON.parse(data);
               if (!res.status) {
                   $captchaErr.removeClass('hidden');
                   captchaLock = false;
               } else {
                   $captchaErr.addClass('hidden');
                   captchaLock = true;
               }
           });
       }
    });

    // 选择协议
    $agreement.on('change',function () {
        $agreement.prop('checked') && $agreementErr.addClass('hidden');
    });

    //确认电子邮件
    var $comfirm = $('#comfirm');
    $comfirm.on('click', '.close-btn,.cancel-btn', function (e) {
        e.preventDefault();
        $comfirm.hide();
    }).on('click','.continue-btn', function (e) {
        var $loading = $('.result-container-fluid'),
            $buyPage = $('.buy-container-fluid');

        e.preventDefault();
        $comfirm.hide();
        $buyPage.addClass('hide');
        $loading.removeClass('hide');
        setTimeout(function () {
            $('form').submit();
        },600);
    });

    // 提交订单
    $('.pay-btn').on('click',function (e) {
        e.preventDefault();

        var email = $('#email').val(),
            $captcha = $('.captcha-input').val().trim(),
            hostArr = [],
            lock = true;

        // 选择节点
        var $noded = $('#node').find('.selected');
        if ($noded.length < 3) {
            $nodeRequire.removeClass('hidden');
            lock = false;
        } else {
            $noded.each(function () {
                hostArr.push($(this).data('id'));
            });
            $('#hostNum').val(hostArr.join(':'));
        }

        // 电邮必填
        if (!$email.val().trim()) {
            $emailErrR.removeClass('hidden');
            lock = false;
        } else {
            if (!checkEmail(email)) {
                lock = false;
            }
        }

        //验证码
        if (!$captcha) {
            $captchaErr.removeClass('hidden');
            lock = false;
        }

        //同意协议
        if (!$agreement.prop('checked')) {
            $agreementErr.removeClass('hidden');
            lock = false;
        }

        if (lock && captchaLock) {
            $comfirm.find('.email-address').text($email.val()).end().show();
        }

    });
});
