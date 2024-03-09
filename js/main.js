



formValidator()



function formValidator() {
    checkValidatorInput()
    ValidatorInput()



    function errorElement(element, selector) {

        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }


        return element;

    }

    // laấy ra element cha (formGroup)





    // input
    function ValidatorInput() {
        Validator({
            form: '#form-1',
            formGroup: '.form-group',
            message: '.form-message',
            rules: [
                Validator.isRequired('#fullname', 'Vui lòng nhâp tên đầy đủ '),
                Validator.isRequired('#email'),
                Validator.isEmail('#email', 'Vui lòng nhập Email'),
                Validator.isRequired('#password', 'Vui lòng Điền mật khẩu', 'Mật khẩu dài hơn 8 ký tự', 'mật khẩu phải có it nhất một chữ cái viết hoa', 'mật khẩu phải có ít nhất một số', 'Mật khẩu phải không có dấu'),
                Validator.isconfirm('#password_confirmation', function () {
                    return document.querySelector('#form-1 #password').value;
                }, 'Vui lòng Điền mật khẩu'),

            ],

            onSubmit: function (data) {
                console.log(data)
            },



        })
    }




    // Sử dụng regex để kiểm tra xem chuỗi có chứa ký tự đấu hay không
    function hasDiacritics(value) {
        var diacriticsRegex = /[ăằắặẵâầẫậêếềệễơớờợỡưứừựữùúụũàáâãäåæçèéêëìíîịïðñòóôõöøùúûüýÿỵỳ]/;
        return diacriticsRegex.test(value);
    }



    function checkValidatorInput() { // kiểm tra giá trị đầu vào 


        Validator.isRequired = function (selector, messageNoti) {
            return {
                selector: selector,
                check: function (value) { // Hàm kiểm tra giá trị
                    if (!value.trim()) { // nếu value rỗng 
                        return messageNoti || 'hãy nhâp trường này'
                    }
                    return value.trim().length >= 10 ? undefined : 'vui lòng nhập trên 10 ký tự' // kiểm tra xem vlue có nhiều hơn 10 kí tự hay không 
                }
            }
        }

        Validator.isEmail = function (selector, messageNoti) {
            return {
                selector: selector,
                check: function (value) {
                    if (!value.trim()) {
                        return messageNoti || 'hãy nhập trường này';
                    }

                    // Đoạn mã kiểm tra địa chỉ email hợp lệ
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailPattern.test(value) ? undefined : 'Địa chỉ email không hợp lệ';
                }
            };
        }


        Validator.isRequired = function (selector, messageNoti, messagePasswordNun, messagePasswordText, messagePasswordkt, messagePasswordd) {

            return {
                selector: selector,
                check: function (value) { // Hàm kiểm tra giá trị
                    if (!value.trim()) { // nếu value rỗng 
                        return messageNoti || 'hãy nhập trường này';
                    }

                    if (value.length < 8) {
                        return messagePasswordNun;
                    }
                    // Kiểm tra xem có ít nhất một chữ cái viết hoa trong mật khẩu hay không
                    if (!/[A-Z]/.test(value)) {
                        return messagePasswordText;
                    }

                    // Kiểm tra xem có ít nhất một ký tự số trong mật khẩu hay không
                    if (!/\d/.test(value)) {
                        return messagePasswordkt;
                    }
                    if (hasDiacritics(value)) {// kiểm tra có dấu hay không 
                        return messagePasswordd;
                    }


                    return undefined


                }
            }
        }


        Validator.isconfirm = function (selector, getpassword, messageNoti) {

            return {
                selector: selector,
                check: function (value) { // Hàm kiểm tra giá trị
                    if (!getpassword()) { //kiểm tra mật khẩu được nhập hay chưa

                        return messageNoti
                    }
                    if (!value.trim()) { // kiểm tra có để trống ô nhập hay không 
                        return 'hãy điền lại mật khẩu'
                    }
                    return value === getpassword() ? undefined : 'mật khẩu không khớp'
                }
            }
        }
    }





    //                       CHECK LỖI
    function errorMessageElement(inputElement, rule, errorElement, formMessage, selectorrules,) {




        var errorElementCon = errorElement.querySelector(formMessage)


        var errorMessage;

        var rules = selectorrules[rule.selector]

        for (var i = 0; i < rules.length; ++i) {


            errorMessage = rules[i] = rule.check(inputElement.value)

            if (errorMessage) break;
        }




        // Nếu không có lỗi
        if (!errorMessage) {
            // Đặt nội dung của phần tử hiển thị lỗi thành rỗng
            errorElementCon.innerText = ' ';
            // Xóa class 'invalid' khỏi phần tử cha của phần tử hiện tại
            errorElement.classList.remove('invalid');
        } else {
            // Nếu có lỗi, đặt nội dung của phần tử hiển thị lỗi là errorMessage
            errorElementCon.innerText = errorMessage;
            // Thêm class 'invalid' vào phần tử cha của phần tử hiện tại
            errorElement.classList.add('invalid');
        }

        inputElement.oninput = function () { // khi người dùng bắt đầu nhập 
            errorElementCon.innerText = ''; // Xóa thông báo lỗi
            errorElement.classList.remove('invalid'); // Xóa class 'invalid'
        }
        return !errorMessage
    }




    // Tạo một đối tượng Validator
    function Validator(options) {







        var selectorrules = {};
        // Lấy tham chiếu đến phần tử biểu mẫu dựa trên selector được chỉ định trong options
        var formElement = document.querySelector(options.form);



        // bỏ mặc định của submit
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFromvalid = true
            // lặp qua từng rule rồi validate luôn 
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);

                var isValid = errorMessageElement(inputElement, rule, errorElement(inputElement), selectorrules);

                if (!isValid) {
                    isFromvalid = false;
                }


            });

            if (isFromvalid) {
                // submit  với javascrip
                if (typeof options.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]:not([disabled])');
                    var inputValues = Array.from(enableInput).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    options.onSubmit(inputValues);
                }
                // trường hợp vơi hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }




        // Kiểm tra xem có tồn tại phần tử biểu mẫu hay không
        if (formElement) {
            // Lặp qua từng quy tắc kiểm tra trong mảng rules được chỉ định trong options
            options.rules.forEach(function (rule) {

                if (Array.isArray(selectorrules[rule.selector])) {

                    selectorrules[rule.selector].push(rule.test);
                } else {
                    selectorrules[rule.selector] = [rule.test];
                }

                var inputElement = formElement.querySelector(rule.selector);


                // Kiểm tra xem có tồn tại phần tử hay không
                if (inputElement) {
                    // Gán sự kiện onblur cho phần tử, xảy ra khi phần tử mất focus
                    inputElement.onblur = function () {
                        // var errorMessage;



                        // Kiểm tra giá trị của phần tử dựa trên quy tắc được xem xét và nhận thông báo lỗi (errorMessage)
                        errorMessageElement(inputElement, rule, errorElement(inputElement, options.formGroup), options.message, selectorrules,)


                    };



                }

            });


        }



    }

}


