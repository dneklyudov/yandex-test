var myForm = new Object()


myForm.validate = function() {
	var 
		isValid     = true,
		errorFields = [],
		formData    = myForm.getData()

	var 
		rePhone    = /^\+7\([0-9]{3}\)[0-9]{3}[-]{1}[0-9]{2}[-]{1}[0-9]{2}$/,
		reEmail    = /[\w-]+[\@]{1}[\w-_]+[\.]{1}[a-zA-Z]{2,3}$/,
		domainList = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com']

	if (formData.fio.split(' ').length != 3) {
		isValid = false
		errorFields.push('fio')
	}

    var 
    	validPhone = rePhone.test(formData.phone)

	if (validPhone) {
		var sum = 0

		for (var i = 0; i < formData.phone.length; i++) {
			if (!isNaN(formData.phone[i])) {
				sum += parseInt(formData.phone[i])
			}
  		}

  		if (sum > 30) {
  			validPhone = false
  		}
    }

	if (!validPhone) {
		isValid = false
		errorFields.push('phone')
	}

	var 
		validEmail = reEmail.test(formData.email)

	if (validEmail) {
		domain = formData.email.substr(formData.email.indexOf('@') + 1)
		if (domainList.indexOf(domain) == -1) {
			validEmail = false
		}
	}

	if (!validEmail) {
		isValid = false
		errorFields.push('email')
	}

	return {isValid, errorFields}
}


myForm.getData = function() {
	var obj = new Object()

	obj.fio   = $('#myForm input[name="fio"]').val()
	obj.email = $('#myForm input[name="email"]').val()
	obj.phone = $('#myForm input[name="phone"]').val()

	return obj
}


myForm.setData = function(obj) {
	$('#myForm input[name="fio"]').val(obj.fio)
	$('#myForm input[name="email"]').val(obj.email)
	$('#myForm input[name="phone"]').val(obj.phone)	
}


myForm.submit = function() {
	result = myForm.validate()

	$('#myForm .error').removeClass('error')

	function run() {
		var url = $('.form-status input:checked').val() + '.json'

		$.getJSON(url, function(data) {
			if (data.status == 'success') {
				$('#resultContainer')
					.addClass('success')
					.text('Success')
			} else if (data.status == 'error') {
				$('#resultContainer')
					.addClass('error')
					.text(data.reason)
			} else if (data.status == 'progress') {
				$('#resultContainer')
					.addClass('progress')
					setTimeout(function() {
						run()
					}, data.timeout)
			}
		})
	}

	if (result.isValid) {
		$('#submitButton').attr('disabled', true)
		run()
	} else {
		result.errorFields
			.forEach(function(item) {
				$('#myForm input[name="' + item + '"]').addClass('error')
			})
	}
}


$(function() {

	$('#submitButton').on('click', function() {
		myForm.submit()
	})

})

