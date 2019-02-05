(function () {

    var app = angular.module('gas');

    app.controller('profileCtrl', function ($timeout, profileService, $scope, $rootScope, $cookies) {
        $scope.ChangePwdProgress = false;
        $scope.ChangePasswordResponse = "";
        $scope.base64 = ""
        $scope.myImage = '';
        $scope.myCroppedImage = '';
        $scope.imageTocrop = false;
        var contentHeight = window.innerHeight - 150;
        $scope.ScreenHeight = contentHeight + "px";

        var handleFileSelect = function (evt) {
            var file = evt.currentTarget.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myImage = evt.target.result;
                   
                });
            };
            reader.readAsDataURL(file);
            //reader.convertToBase64(function (base64) {
            //    $scope.base64 = base64;
            //    alert(base64);

            //})
           

           $scope.imageTocrop = true;
        };
        angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);


        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }

        $scope.Upload = function ()
        {
            var base64 = getBase64Image(document.getElementById("ImgPreview"));
            var ImageData = { UserID: $rootScope.UserId, ImageString: base64 };
            //alert(JSON.stringify(ImageData));
            profileService.addImage(ImageData)
            .then(function (resp) {
                //alert(JSON.stringify(resp));
                if (resp.data.Response =="OK")
                {
                    localStorage.ProfileImage = $rootScope.ProfileImage = "data:image/jpeg;base64," + base64;
                    $scope.imageTocrop = false;
                    //alert("Image Uploaded");
                }

            });


        }


        $scope.ChangePassword = function () {
            if ($scope.newPwd == $scope.newPwd2) {
                $scope.ChangePwdProgress = true;
                profileService.ChangePassword($rootScope.UserId, $scope.newPwd)
                .then(function (res) {
                    alert(JSON.stringify(res));
                    $scope.ChangePwdProgress = false;
                     if(res.Response == "OK")
                    { $scope.ChangePasswordResponse = "Password Changed Successfully"; }
                    else if(res.Response == "Exception")
                    {
                        $scope.ChangePasswordResponse = "Error ocurred! try later or contact admin.";
                    }

                });
            }
            else {
                $scope.ChangePasswordResponse = "Password Do not match.";
            }
        }

    });

}());