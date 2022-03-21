(function($){

    let mainFolder = "***/okulhediyem";
    let OkulHediyem = {
        map: `${ mainFolder }/router.php`,
        guid: "",
        document: false,
        trigger: false,
        properties: false,
        counter: false,
        posts: {
            form: async function(maxQuantity, onlyName, header){
                return $.post(OkulHediyem.map, {
                    maxQuantity: maxQuantity,
                    onlyName: onlyName,
                    header: header,
                    postType: "getForm"
                });
            },
            image: async function(name, showInput){
                return $.post(OkulHediyem.map, {
                    name: name,
                    showInput: showInput,
                    postType: "getItem"
                });
            },
            upload: async function(_this, form, size){
                return $.ajax({ url: OkulHediyem.map, type: "POST", data:form, xhr: () => {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(event){
                        if (event.lengthComputable){
                            if (event.loaded > size){
                                return false;
                            }
                            _this.parents(".container:eq(0)").find("#progress_bar").css({"width": ((event.loaded / event.total) * 100) + "%"});
                        }
                    }, false);
                    return xhr;
                }, cache: false, contentType: false, processData: false});
            },
            remove: async function(name){
                return $.post(OkulHediyem.map, {
                    name: name,
                    folder: OkulHediyem.guid,
                    postType: "removeFile"
                });
            },
            zip: async function(info){
                return $.post(OkulHediyem.map, {
                    folder: OkulHediyem.guid,
                    info: JSON.stringify(info),
                    postType: "createZip"
                });
            },
            update: async function(orj, target){
                return $.post(OkulHediyem.map, {
                    orj: orj,
                    folder: OkulHediyem.guid,
                    target: target, 
                    postType: "update"
                })
            },
            copy: async function(counter, type){
                return $.post(OkulHediyem.map, {
                    counter: counter,
                    folder: OkulHediyem.guid,
                    type: type,
                    postType: "copy"
                });
            }
        },
        eventlisteners: {
            readymade: {
                guid: function(){
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                },
                asyncForEach: async function(array, callback){
                    for (let index = 0; index < Object.keys(array).length; index++) {
                        await callback(array[index], index, array);
                    }
                },
                swal: {
                    extensionError: function(){
                        swal.fire({
                            title: "Geçersiz Dosya Tipi!",
                            text: "Sadece \".zip, .jpg, .jpeg, .png, .tiff, .psd, .gif, .pdf, .doc, .docx, .xls ve .xlsx\" fromatında resimler kabul edilmektedir.",
                            icon: "warning",
                            confirmButtonText: "Tamam"
                        });
                    },
                    duplicateImageError: function(){
                        swal.fire({
                            title: "Dosya Listenizde Mevcut!",
                            text: "Lütfen daha fazla dosya için listenizi düzenleyiniz.",
                            icon: "warning",
                            confirmButtonText: "Tamam"
                        });
                    },
                    maxImageError: function(){
                        swal.fire({
                            title: "Dosya Limitine Ulaştınız!",
                            text: "Lütfen daha fazla dosya için listenizi düzenleyiniz.",
                            icon: "warning",
                            confirmButtonText: "Tamam"
                        });
                    },
                    noImageError: function(target){
                        swal.fire({
                            title: "Zorunlu Dosya Alan!",
                            text: `"${ target }" dosya alanı zorunlu alandır.`,
                            icon: "warning",
                            confirmButtonText: "Tamam"
                        });
                    },
                    notEnoughImageError: function(target){
                        swal.fire({
                            title: "Yetersiz Dosya!",
                            text: `Lütfen "${ target }" alanına resim ekleyiniz veya mevcut resimlerinizin sayısını arttırınız.`,
                            icon: "warning",
                            confirmButtonText: "Tamam"
                        });
                    }
                }
            },
            checkproperties: function(){
                
                if(marketPriceDetail === "" || marketPriceDetail.indexOf(",") < 0){
                    return false;
                }

                let properties = {
                    image: {
                        active: false,
                        maxQuantity: 0,
                        required: false
                    },
                    cover: {
                        active: false,
                        maxQuantity: 0,
                        required: false
                    },
                    other: {
                        syncQuantity: false,
                        showInput: false,
                        onlyName: false
                    }
                }

                let propController1 = marketPriceDetail.split(",")[0].trim();
                let propController2 = marketPriceDetail.split(",")[1].trim();
                let propController3 = marketPriceDetail.split(",")[2].trim();
                let propController4 = marketPriceDetail.split(",")[3].trim();
                let propController5 = marketPriceDetail.split(",")[4].trim();

                if(propController1.indexOf("/z") > -1){
                    if(propController1.replace("/z", "").split("-")[0].trim() === "1"){
                        properties.image.active = true;
                        properties.image.required = true;
                        properties.image.maxQuantity = parseInt(propController1.replace("/z", "").split("-")[1].trim());
                    }
                }else{
                    if(propController1.split("-")[0].trim() === "1"){
                        properties.image.active = true;
                        properties.image.required = false;
                        properties.image.maxQuantity = parseInt(propController1.split("-")[1].trim());
                    }
                }

                if(propController2.indexOf("/z") > -1){
                    if(propController2.replace("/z", "").split("-")[0].trim() === "1"){
                        properties.cover.active = true;
                        properties.cover.required = true;
                        properties.cover.maxQuantity = parseInt(propController2.replace("/z", "").split("-")[1].trim());
                    }
                }else{
                    if(propController2.split("-")[0].trim() === "1"){
                        properties.cover.active = true;
                        properties.cover.required = false;
                        properties.cover.maxQuantity = parseInt(propController2.split("-")[1].trim());
                    }
                }

                if(propController3 === "1") properties.other.syncQuantity = true;
                if(propController4 === "1") properties.other.showInput = true;
                if(propController5 === "1") properties.other.onlyName = true;

                OkulHediyem.properties = properties;

            },
            modulactivated: function(){

                if(window.location.href.indexOf("/urun") < -1){
                    return false;
                }

                this.checkproperties();
                if(OkulHediyem.properties === false){
                    return false;
                }

                if($("[data-wrapper='image-upload-extension']").length > 0){
                    return false;
                }else if($("[data-wrapper='cover-upload-extension']").length > 0){
                    return false;
                }

                if($(".product-list-content .variant-select .variant-list").length > 0){
                    let variant = true;
                    $(".product-list-content .variant-select .variant-list").each(function(){
                        if (parseInt($(this).find("select option:selected").val()) === 0) {
                            variant = false;
                        }
                    });
                    if(variant === false){
                        return false;
                    }
                }

                this.init();

            },
            init: function(){

                let _this = this;

                OkulHediyem.guid = OkulHediyem.eventlisteners.readymade.guid();
                OkulHediyem.counter = { upload: { cover: 0, image: 0 }, row: { cover: 0, image: 0 } }
                
                if(OkulHediyem.properties.image.active !== false && OkulHediyem.properties.image.maxQuantity !== 0){
                    this.propertyactivated.image();
                }

                if(OkulHediyem.properties.cover.active !== false && OkulHediyem.properties.cover.maxQuantity !== 0){
                    this.propertyactivated.cover();
                }

                if(OkulHediyem.properties.other.syncQuantity === false){
                    $(".product-right [data-selector='qty']").parents(".product-qty-wrapper:eq(0)").hide();
                }

                if(OkulHediyem.document === false){

                    OkulHediyem.document = true;

                    $(document).ready(function(){
                        $(".product-right [data-selector='add-to-cart']").removeAttr("data-selector").attr("id", "add-to-cart");
                    });

                    $(document).on("DOMNodeRemoved", ".loading-bar", function(){
                        $(".product-right [data-selector='add-to-cart']").removeAttr("data-selector").attr("id", "add-to-cart");
                    });

                    $(document).on("change", ".product-right [data-selector='qty']", function(){
                        $("[data-wrapper='image-upload-extension'] #maxQuantity").text($(this).val());
                        OkulHediyem.properties.image.maxQuantity = parseInt($(this).val());
                        if(OkulHediyem.counter.upload.image > OkulHediyem.properties.image.maxQuantity){
                            _this.clearImageList();
                        }
                    });

                    $(document).on("input", "[data-wrapper='cover-upload-extension'] #name input, [data-wrapper='image-upload-extension'] #name input", function(){
                        $(this).removeClass("border-danger");
                        $(this).parents("[data-wrapper='image-list']").find(".alert").remove();
                    });

                    $(document).on("change", "[data-wrapper='image-upload-extension'] [type='file'], [data-wrapper='cover-upload-extension'] [type='file']", function(){
                        let self = $(this);
                        let files = $(this)[0].files;
                        let error = false;
                        $(this).attr("disabled", true).parent().find("label").addClass("disabled");
                        $("#add-to-cart[data-context='quick'], #add-to-cart[data-context='detail'], .product-right #qty-input").addClass("disabled");
                        for (let index = 0; index < files.length; index++) {
                            error = false;
                            if(_this.fileController.extension(files[index]) === false){
                                OkulHediyem.eventlisteners.readymade.swal.extensionError();
                                error = true;
                            }
                            if(_this.fileController.duplicate($(this), files[index]) !== false){
                                OkulHediyem.eventlisteners.readymade.swal.duplicateImageError();
                                error = true;
                            }
                            if(_this.fileController.max($(this)) === false){
                                OkulHediyem.eventlisteners.readymade.swal.maxImageError();
                                error = true;
                            }
                            if(error === false){
                                let reader = new FileReader();
                                let form = new FormData();
                                let currentTargetName = files[index].name;
                                reader.onload = () => {
                                    OkulHediyem.posts.image(currentTargetName, OkulHediyem.properties.other.showInput).then(response => {
                                        $(this).parents(".container:eq(0)").find("[data-wrapper='image-list']").append(response);
                                    });
                                }
                                reader.readAsDataURL(files[index]);
                                form.append("type", $(this).attr("id"));
                                form.append("folder", OkulHediyem.guid);
                                form.append("image", files[index]);
                                $(this).parents(".container:eq(0)").find("#uploaded").text(_this.fileController.uploadIncrease($(this)));
                                OkulHediyem.posts.upload($(this), form, files[index].size).then(function(response){
                                    let eq = OkulHediyem.counter.row.cover;
                                    if(typeof self.attr("id") !== "undefined" && self.attr("id") === "file-0"){
                                        OkulHediyem.counter.row.cover++;
                                    }else if(typeof self.attr("id") !== "undefined" && self.attr("id") === "file-1"){
                                        eq = OkulHediyem.counter.row.image;
                                        OkulHediyem.counter.row.image++;
                                    }
                                    response = `${ mainFolder }${ response }`;
                                    let interval = setInterval(function(){
                                        if(self.parent().find("[data-wrapper='image-list'] > .row:eq(" + eq + ") [data-wrapper='preview'] a").length > 0){
                                            clearInterval(interval);
                                            self.parent().find("[data-wrapper='image-list'] > .row:eq(" + eq + ") [data-wrapper='preview'] a").attr("href", response);
                                            self.parent().find("[data-wrapper='image-list'] > .row:eq(" + eq + ") [data-wrapper='preview'] img").attr("src", response);
                                            self.removeAttr("disabled", false).parent().find("label").removeClass("disabled");
                                            $("#add-to-cart[data-context='quick'], #add-to-cart[data-context='detail'], [data-wrapper='image-list'] #remove, .product-right #qty-input").removeClass("disabled");
                                        }
                                    });
                                });
                            }
                        }
                        $(this).val(null);
                    });

                    $(document).on("click", "[data-wrapper='image-upload-extension'] #remove", function(){
                        let targetRow = {
                            self: $(this),
                            quantity: parseInt($(this).parents("[data-wrapper='edit']").find("[type='number']").val()),
                            name: $(this).parents(".row:eq(0)").find("[data-wrapper='preview'] img").attr("src").split("/")
                        }
                        targetRow.name = targetRow.name[targetRow.name.length - 1];
                        OkulHediyem.counter.upload.image -= targetRow.quantity;
                        OkulHediyem.counter.row.image--;
                        $("[data-wrapper='image-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.image);
                        OkulHediyem.posts.remove(targetRow.name).then(function(){
                            targetRow.self.parents(".row:eq(0)").remove();
                        });
                    });

                    $(document).on("click", "[data-wrapper='cover-upload-extension'] #remove", function(){
                        let targetRow = {
                            self: $(this),
                            quantity: parseInt($(this).parents("[data-wrapper='edit']").find("[type='number']").val()),
                            name: $(this).parents(".row:eq(0)").find("[data-wrapper='preview'] img").attr("src").split("/")
                        }
                        targetRow.name = targetRow.name[targetRow.name.length - 1];
                        OkulHediyem.counter.upload.cover -= targetRow.quantity;
                        OkulHediyem.counter.row.cover--;
                        $("[data-wrapper='cover-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.cover);
                        OkulHediyem.posts.remove(targetRow.name).then(function(){
                            targetRow.self.parents(".row:eq(0)").remove();
                        });
                    });

                    $(document).on("click", "[data-wrapper='image-upload-extension'] [data-selector='increase']", function(){
                        let targetRowQuantity = parseInt($(this).parents("[data-wrapper='edit']").find("[type='number']").val());
                        if(OkulHediyem.counter.upload.image === OkulHediyem.properties.image.maxQuantity){
                            return false;
                        }
                        targetRowQuantity++;
                        OkulHediyem.counter.upload.image++;
                        $(this).parents("[data-wrapper='edit']").find("[type='number']").val(targetRowQuantity);
                        $("[data-wrapper='image-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.image);
                    });

                    $(document).on("click", "[data-wrapper='cover-upload-extension'] [data-selector='increase']", function(){
                        let targetRowQuantity = parseInt($(this).parents("[data-wrapper='edit']").find("[type='number']").val());
                        if(OkulHediyem.counter.upload.cover === OkulHediyem.properties.cover.maxQuantity){
                            return false;
                        }
                        targetRowQuantity++;
                        OkulHediyem.counter.upload.cover++;
                        $(this).parents("[data-wrapper='edit']").find("[type='number']").val(targetRowQuantity);
                        $("[data-wrapper='cover-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.cover);
                    });

                    $(document).on("click", "[data-wrapper='image-upload-extension'] [data-selector='decrease']", function(){
                        let targetRowQuantity = parseInt($(this).parents("[data-wrapper='edit']").find("[type='number']").val());
                        if(targetRowQuantity === 1){
                            return false;
                        }
                        targetRowQuantity--;
                        OkulHediyem.counter.upload.image--;
                        $(this).parents("[data-wrapper='edit']").find("[type='number']").val(targetRowQuantity);
                        $("[data-wrapper='image-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.image);
                    });

                    $(document).on("click", "[data-wrapper='cover-upload-extension'] [data-selector='decrease']", function(){
                        let targetRowQuantity = parseInt($(this).parents("[data-wrapper='edit']").find("[type='number']").val());
                        if(targetRowQuantity === 1){
                            return false;
                        }
                        targetRowQuantity--;
                        OkulHediyem.counter.upload.cover--;
                        $(this).parents("[data-wrapper='edit']").find("[type='number']").val(targetRowQuantity);
                        $("[data-wrapper='cover-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.cover);
                    });

                    $(document).on("click", "[data-wrapper='image-upload-extension'] [data-selector='add-to-image-list']", function(){
                        let self = $(this);
                        if(OkulHediyem.counter.upload.image === OkulHediyem.properties.image.maxQuantity){
                            return false;
                        }
                        OkulHediyem.posts.image("deafult.jpg", OkulHediyem.properties.other.onlyName).then(function(response){
                            self.parent().find("[data-wrapper='image-list']").append(response);
                            OkulHediyem.counter.upload.image++;
                            $("[data-wrapper='image-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.image);
                            OkulHediyem.posts.copy(OkulHediyem.counter.row.image, "image").then(function(response2){
                                self.parent().find("[data-wrapper='image-list'] > .row").last().find("[data-wrapper='preview'] a").attr("href", response2);
                                self.parent().find("[data-wrapper='image-list'] > .row").last().find("[data-wrapper='preview'] img").attr("src", response2);
                                self.parent().find("[data-wrapper='image-list'] > .row").last().find("#remove").removeClass("disabled");
                                OkulHediyem.counter.row.image++;
                            });
                        });
                    });

                    $(document).on("click", "[data-wrapper='cover-upload-extension'] [data-selector='add-to-image-list']", function(){
                        let self = $(this);
                        if(OkulHediyem.counter.upload.cover === OkulHediyem.properties.cover.maxQuantity){
                            return false;
                        }
                        OkulHediyem.posts.image("deafult.jpg", OkulHediyem.properties.other.onlyName).then(function(response){
                            self.parent().find("[data-wrapper='image-list']").append(response);
                            OkulHediyem.counter.upload.cover++;
                            $("[data-wrapper='cover-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.cover);
                            OkulHediyem.posts.copy(OkulHediyem.counter.row.cover, "cover").then(function(response2){
                                self.parent().find("[data-wrapper='image-list'] > .row").last().find("[data-wrapper='preview'] a").attr("href", response2);
                                self.parent().find("[data-wrapper='image-list'] > .row").last().find("[data-wrapper='preview'] img").attr("src", response2);
                                OkulHediyem.counter.row.cover++;
                            });
                        });
                    });

                    $(document).on("click", ".product-right #add-to-cart", async function(){
                        let self = $(this);
                        if(OkulHediyem.trigger === false){
                            if($("[data-wrapper='image-upload-extension']").length > 0 && $("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] > .row").length < 1){
                                OkulHediyem.eventlisteners.readymade.swal.noImageError("Görsel Yükleme");
                                return false;
                            }
                            if($("[data-wrapper='image-upload-extension']").length < 1 && $("[data-wrapper='cover-upload-extension']").length > 0){
                                if($("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list'] > .row").length < 1){
                                    OkulHediyem.eventlisteners.readymade.swal.noImageError("Kapak Görseli");
                                    return false;
                                }
                            }
                            if($("[data-wrapper='image-upload-extension']").length > 0 && OkulHediyem.properties.image.required !== false){
                                if($("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] > .row").length < 1 || OkulHediyem.counter.upload.image < OkulHediyem.properties.image.maxQuantity){
                                    OkulHediyem.eventlisteners.readymade.swal.notEnoughImageError("Görsel Yükleme");
                                    return false;
                                }
                            }
                            if($("[data-wrapper='cover-upload-extension']").length > 0 && OkulHediyem.properties.cover.required !== false){
                                if($("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list'] > .row").length < 1 || OkulHediyem.counter.upload.cover < OkulHediyem.properties.cover.maxQuantity){
                                    OkulHediyem.eventlisteners.readymade.swal.notEnoughImageError("Kapak Görseli");
                                    return false;
                                }
                            }
                            if($("[data-wrapper='image-upload-extension']").length > 0 && OkulHediyem.properties.other.syncQuantity !== false){
                                if($("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] > .row").length < 1 || OkulHediyem.counter.upload.image < OkulHediyem.properties.image.maxQuantity){
                                    OkulHediyem.eventlisteners.readymade.swal.notEnoughImageError("Görsel Yükleme");
                                    return false;
                                }
                            }
                            if($("[data-wrapper='cover-upload-extension']").length > 0 && OkulHediyem.properties.other.syncQuantity !== false){
                                if($("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] > .row").length < 1 || OkulHediyem.counter.upload.image < OkulHediyem.properties.image.maxQuantity){
                                    OkulHediyem.eventlisteners.readymade.swal.notEnoughImageError("Kapak Görseli");
                                    return false;
                                }
                            }
                            if($("[data-wrapper='image-upload-extension']").length > 0 && OkulHediyem.properties.other.showInput !== false){
                                let _return = true;
                                let array = new Array();
                                await OkulHediyem.eventlisteners.readymade.asyncForEach($("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] > .row"), function(_object){
                                    if($(_object).length > 0){
                                        if($(_object).find("#name input").val() === ""){
                                            $(_object).find("#name input").addClass("border-danger");
                                            _return = "errorCode1";
                                        }else {
                                            if($.inArray($(_object).find("#name input").val(), array) < 0){
                                                array.push($(_object).find("#name input").val());
                                            }else{
                                                $(_object).find("#name input").addClass("border-danger");
                                                _return = "errorCode2";
                                            }
                                        }
                                    }
                                });
                                if(_return !== true){
                                    if(_return === "errorCode1" && $("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] .alert").length < 1){
                                        $("[data-wrapper='image-upload-extension'] [data-wrapper='image-list']").append(`<div class="alert alert-warning m-0 mt-3 small text-center font-weight-bold" role="alert">
                                            Dosya ismi boş bırakılamaz.
                                        </div>`);
                                    }else if(_return === "errorCode2" && $("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] .alert").length < 1){
                                        $("[data-wrapper='image-upload-extension'] [data-wrapper='image-list']").append(`<div class="alert alert-warning m-0 mt-3 small text-center font-weight-bold" role="alert">
                                            Aynı dosya ismi ile en fazla bir adet dosya yüklenmektedir.
                                        </div>`);
                                    }
                                    return false;
                                }
                            }
                            if($("[data-wrapper='cover-upload-extension']").length > 0 && OkulHediyem.properties.other.showInput !== false){
                                let _return = true;
                                let array = new Array();
                                await OkulHediyem.eventlisteners.readymade.asyncForEach($("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list'] > .row"), function(_object){
                                    if($(_object).length > 0){
                                        if($(_object).find("#name input").val() === ""){
                                            $(_object).find("#name input").addClass("border-danger");
                                            _return = "errorCode1";
                                        }else {
                                            if($.inArray($(_object).find("#name input").val(), array) < 0){
                                                array.push($(_object).find("#name input").val());
                                            }else{
                                                $(_object).find("#name input").addClass("border-danger");
                                                _return = "errorCode2";
                                            }
                                        }
                                    }
                                });
                                if(_return !== true){
                                    if(_return === "errorCode1" && $("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list'] .alert").length < 1){
                                        $("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list']").append(`<div class="alert alert-warning m-0 mt-3 small text-center font-weight-bold" role="alert">
                                            Dosya ismi boş bırakılamaz.
                                        </div>`);
                                    }else if(_return === "errorCode2" && $("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list'] .alert").length < 1){
                                        $("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list']").append(`<div class="alert alert-warning m-0 mt-3 small text-center font-weight-bold" role="alert">
                                            Aynı dosya ismi ile en fazla bir adet dosya yüklenmektedir.
                                        </div>`);
                                    }
                                    return false;
                                }
                            }
                            let zip = {
                                cover: false,
                                image: false
                            };
                            let target = $(".product-right [data-wrapper='image-upload-extension']");
                            let target2 = $(".product-right [data-wrapper='cover-upload-extension']");
                            if(target.length > 0){
                                zip.image = new Array();
                                await OkulHediyem.eventlisteners.readymade.asyncForEach(target.find("[data-wrapper='image-list'] > .row"), function(_object){
                                    if($(_object).length > 0){
                                        if($(_object).find("#name input").length > 0){
                                            zip.image.push({
                                                name: $(_object).find("#name input").val(),
                                                quantity: $(_object).find("[data-wrapper='edit'] [type='number']").val()
                                            });
                                            OkulHediyem.posts.update(
                                                $(_object).find("[data-wrapper='preview'] img").attr("src").split("/")[$(_object).find("[data-wrapper='preview'] img").attr("src").split("/").length - 1],
                                                $(_object).find("#name input").val()
                                            );
                                        }else{
                                            zip.image.push({
                                                name: $(_object).find("#name").text().trim(),
                                                quantity: $(_object).find("[data-wrapper='edit'] [type='number']").val()
                                            });
                                        }
                                    }
                                });
                            }
                            if(target2.length > 0){
                                zip.cover = new Array();
                                await OkulHediyem.eventlisteners.readymade.asyncForEach(target2.find("[data-wrapper='image-list'] > .row"), function(_object){
                                    if($(_object).length > 0){
                                        if($(_object).find("#name input").length > 0){
                                            zip.cover.push({
                                                name: $(_object).find("#name input").val(),
                                                quantity: $(_object).find("[data-wrapper='edit'] [type='number']").val()
                                            });
                                            OkulHediyem.posts.update(
                                                $(_object).find("[data-wrapper='preview'] img").attr("src").split("/")[$(_object).find("[data-wrapper='preview'] img").attr("src").split("/").length - 1],
                                                $(_object).find("#name input").val()+" - Kapak Görseli"
                                            );
                                        }else{
                                            zip.cover.push({
                                                name: $(_object).find("#name").text().trim(),
                                                quantity: $(_object).find("[data-wrapper='edit'] [type='number']").val()
                                            });
                                        }
                                    }
                                });
                            }
                            OkulHediyem.posts.zip(zip).then(function(response){
                                $(".product-customization-group[data-group-id='1'] textarea").val(response);
                                OkulHediyem.trigger = true;
                                self.attr("data-selector", "add-to-cart");
                                self.attr("data-quantity", $(".product-right [data-selector='qty-wrapper'] #qty-input").val());
                                self.trigger("click");
                            });
                        }else{
                            OkulHediyem.trigger = false;
                            self.removeAttr("data-selector");
                            _this.clearImageList(true);
                        }
                    });

                }

            },
            fileController:{

                extension: function(file){
                    let extAllow = false, extensions = new Array(
                        "image/jpg", "image/jpeg", "image/png", "image/gif", "application/x-zip-compressed", "image/tiff",
                        "application/pdf", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
                    for (let index = 0; index < extensions.length; index++) {
                        if(file.type === extensions[index]){
                            extAllow = true;
                            break;
                        }
                    }
                    return extAllow;
                },
                duplicate: function(self, file){
                    let hasImage = false;
                    let currentTarget;
                    self.parents(".container:eq(0)").find("[data-wrapper='image-list'] > .row").each(function(){
                        currentTarget = $(this).find("[data-wrapper='preview'] img").attr("src").split("/");
                        currentTarget = currentTarget[currentTarget.length - 1];
                        if(currentTarget.trim() === file.name.trim()){
                            hasImage = true;
                        }
                    });
                    return hasImage;
                },
                max: function(self){
                    let maxAllow = true;
                    if(typeof self.attr("id") && self.attr("id") === "file-0"){
                        if(OkulHediyem.counter.upload.cover >= OkulHediyem.properties.cover.maxQuantity){
                            maxAllow  = false;
                        }
                    }else if(typeof self.attr("id") && self.attr("id") === "file-1"){
                        if(OkulHediyem.counter.upload.image >= OkulHediyem.properties.image.maxQuantity){
                            maxAllow  = false;
                        }
                    }
                    return maxAllow;
                },
                uploadIncrease: function(self){
                    if(typeof self.attr("id") && self.attr("id") === "file-0"){
                        OkulHediyem.counter.upload.cover++;
                        return OkulHediyem.counter.upload.cover;
                    }else if(typeof self.attr("id") && self.attr("id") === "file-1"){
                        OkulHediyem.counter.upload.image++;
                        return OkulHediyem.counter.upload.image;
                    }
                }
            },
            clearImageList: async function(clearType = false){

                if($("[data-wrapper='image-upload-extension']").length > 0){
                    await this.readymade.asyncForEach($("[data-wrapper='image-upload-extension'] [data-wrapper='image-list'] > .row"), function(_object){
                        $(_object).remove();
                    });
                    OkulHediyem.counter.upload.image = 0
                    $("[data-wrapper='image-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.image);
                }
                
                if(clearType !== false){
                    if($("[data-wrapper='cover-upload-extension']").length > 0){
                        await this.readymade.asyncForEach($("[data-wrapper='cover-upload-extension'] [data-wrapper='image-list'] > .row"), function(_object){
                            $(_object).remove();
                        });
                        OkulHediyem.counter.upload.cover = 0
                        $("[data-wrapper='cover-upload-extension'] #uploaded").text(OkulHediyem.counter.upload.cover);
                    }
                }

            },
            propertyactivated:{

                image: function(){
                    
                    if(OkulHediyem.properties.other.syncQuantity !== false){
                        OkulHediyem.properties.image.maxQuantity = parseInt($(".product-right [data-selector='qty']").val());
                    }

                    OkulHediyem.posts.form(OkulHediyem.properties.image.maxQuantity, OkulHediyem.properties.other.onlyName, "Görsel Yükleme").then(function(response){
                        $(".product-right .product-cart-buttons").before(`<div class="container" data-wrapper="image-upload-extension"></div>`);
                        $("[data-wrapper='image-upload-extension']").append(response);
                    });

                },

                cover: function(){

                    OkulHediyem.posts.form(OkulHediyem.properties.cover.maxQuantity, OkulHediyem.properties.other.onlyName, "Kapak Görseli").then(function(response){
                        let elem = $(`<div class="container" data-wrapper="cover-upload-extension"></div>`);
                        if ($("[data-wrapper='image-upload-extension']").length > 0){
                            $("[data-wrapper='image-upload-extension']").before(elem);
                        }else{
                            $(".product-right .product-cart-buttons").before(elem);
                        }
                        $("[data-wrapper='cover-upload-extension']").append(response);
                    });
                    
                }

            }
        }
    }

    $(document).ready(function(){
        OkulHediyem.eventlisteners.modulactivated();
    });

    $(document).on("DOMNodeRemoved", ".loading-bar", function(){
        OkulHediyem.eventlisteners.modulactivated();
    });

})(jQuery);
