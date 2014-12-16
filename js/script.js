$(function () {

    var imgNumber = {};
    var dropbox = $('#dropbox'),
		message = $('.message', dropbox);

    dropbox.filedrop({
        // The name of the $_FILES entry:
        paramname: 'pic',

        maxfiles: 5,
        maxfilesize: 4,
        url: 'Handler.ashx',

        uploadFinished: function (i, file, response) {
            //上传完毕
            $("#myMic" + imgNumber.ID).attr('save', "yes");
            //$.data(file).addClass('done');
            // response is the JSON object that post_file.php returns
        },

        error: function (err, file) {
            switch (err) {
                case 'BrowserNotSupported':
                    showMessage('Your browser does not support HTML5 file uploads!');
                    break;
                case 'TooManyFiles':
                    alert('Too many files! Please select 5 at most! (configurable)');
                    break;
                case 'FileTooLarge':
                    alert(file.name + ' is too large! Please upload files up to 2mb (configurable).');
                    break;
                default:
                    break;
            }
        },

        // Called before each upload is started
        beforeEach: function (file) {
            if (!file.type.match(/^image\//)) {
                alert('Only images are allowed!');

                // Returning false will cause the
                // file to be rejected
                return false;
            }
        },

        uploadStarted: function (i, file, len) {
            createImage(file);
        },

        progressUpdated: function (i, file, progress) {
            $.data(file).find('.progress').width(progress);
        }

    });




    function createImage(file) {
        //get new id foreach preview object.

        var myImgs = $(".preview");
        var imgID = "Img" + (myImgs.length + 1);
        if (myImgs.lenth > 0) {
            for (var myimg in myImgs) {
                if (myimg.ID == imgID) {
                    imgID += "1";
                }
            }
        }
        imgNumber.ID = imgID;
        //get new id over

        //remove all save button first
        $(".btnSave").css('display', 'none');

        var template = '<div class="preview" id="' + imgID + '">' +
						'<span class="imageHolder">' +
        //close button
                            '<a href="#" class="ui-dialog-titlebar-close ui-close-img" id="close-img' + imgID + '" role="button" close="' + imgID + '" style="position:absolute;z-index:5;left:2px;"><span class="ui-icon ui-icon-closethick">close</span></a>' +
							'<img class="myMics" id="myMic' + imgID + '" unselectable="on" dialog=""/>' +
        //save button
							'<span class="uploaded"><input type="button" value="Save" class="btnSave" style="margin:0 auto; width:100px;height:50px;bottom:0px;" onclick="save()"/></span>' +
						'</span>' +
					'</div>';

        var preview = $(template),
			image = $('img', preview);

        var reader = new FileReader();

        // image.width = 100;
        // image.height = 100;

        reader.onload = function (e) {

            // e.target.result holds the DataURL which
            // can be used as a source of the image:
            
            // get the img width and height
            var img = new Image();
            img.onload = function() {
                addImage(e.target.result,this.width,this.height)
            }
            img.src = e.target.result;

            image.attr('src', e.target.result);
            
        };

        // Reading the file as a DataURL. When finished,
        // this will trigger the onload function above:
        reader.readAsDataURL(file);

        message.hide();
        preview.appendTo(dropbox);

        // Associating a preview container
        // with the file, using jQuery's $.data():

        $.data(file, preview);

        //定义点击关闭图片按钮的事件
        $("#close-img" + imgID).click(function () {
            // document.removeChild($(this));
            // document.removeChild($(this));
            //关闭图片
            //先删除与他相关的dialog
            var strDialog = $("#myMic" + imgID).attr("dialog");
            var arrDialog = strDialog.split(",");
            for (var key in arrDialog) {
                if (arrDialog[key] != "") {
                    $("#" + arrDialog[key]).remove();
                    $("#" + arrDialog[key]).dialog("destroy")
                }
                else {
                    continue;
                }
            }
            //再移除图片
            $("#" + imgID).remove();

            //如果没有图片 显示提示信息
            if ($(".preview").length == 0) {
                $(".message").css('display', '');
            }

            //如果还有图片 至少显示一个保存按钮
            intBtnSave = $(".btnSave").length;
            if (intBtnSave > 0) {
                newBtn = $(".btnSave")[intBtnSave - 1];
                newBtn.style.display = '';
            }
            return false;

        });

        
    }

    

    

    function showMessage(msg) {
        message.html(msg);
    }

});