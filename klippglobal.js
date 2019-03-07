var array_label_color = [0, "new", "seen", "in_process", "waiting", "closed", "resolved", "approved", "parcial_approved", "finished", "onanalysis"];
function dayDifference(current_date, old_date){
    let dateFirst = new Date(current_date);
    let dateSecond = new Date(old_date);

    // time difference
    let day_is_negative = 1;
    if(dateSecond.getTime() < dateFirst.getTime()){
        day_is_negative  = -1;
    }

    let timeDiff = Math.abs(dateSecond.getTime() - dateFirst.getTime());

    // days difference
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // difference
    return day_is_negative * diffDays;
}

function DataChangedDetailsKlipp(){
    let data_changed = {};
    data_changed.data = null;
    data_changed.sum = function(){
        return "Hola";        
    }
    data_changed.setData = function(array_data){
        if(array_data == null){
            /* Definimos solos los que se cambiaron los datos que cambiaron */
            var aux_data_dt_klp = {};
            $(".inpt-was-changed-dtl-klp").each(function(){
                var field_name = $(this).data().field_name;
                if($(this).is("select")){
                    
                    switch (field_name) {
                        case 'status':
                            aux_data_dt_klp["status"] = {};
                            aux_data_dt_klp["status"]["id"] = $(this).val();
                            aux_data_dt_klp["status"]["name"] = $(this).find("option:selected").text();
                            break;
                        default:
                            aux_data_dt_klp[field_name] = $(this).val();
                            break;
                    }

                }else{
                   /* is input */ 
                    aux_data_dt_klp[field_name] = $(this).val();
                }
            });
            this.data = aux_data_dt_klp;
        }
        var obs_tr =  $("#list-observers-klipp-details tr");
        obs_tr.each(function(){
            var data = $(this).data();
            aux_data_dt_klp[data.name_profile] = $(this).find(".name-observer-details").find("span").text();
        });
    }

    data_changed.isSaveOnServer = function(is_save){

        this.save_on_server = is_save;

    }
    data_changed.getData = function(){

        return this.data;
    }

    return data_changed;
}

/* Order divs */

function OrderDivs(){
    let divOrder = {};
    divOrder.classSorteable = 0;
    divOrder.classElement = 0;
    divOrder.setClassSorteable = function(classSorteable){
        this.classSorteable = classSorteable;
    }
    divOrder.setClassElement = function(classElement){
        this.classElements = classElement;
    }

    divOrder.asc = function(propery_div_compare){
        let element_class = this.classElement;

        $(this.classSorteable).each(function(){
            var $this = $(this);

            $this.append($this.find(element_class).get().sort(function(a, b) {
                return $(a).data(propery_div_compare) - $(b).data(propery_div_compare);
            }));
        });

    }

    divOrder.desc = function(propery_div_compare){
        let element_class = this.classElement;

        $(this.classSorteable).each(function(){
            var $this = $(this);

            $this.append($this.find(element_class).get().sort(function(a, b) {
                return $(b).data(propery_div_compare) - $(a).data(propery_div_compare);
            }));
        });
    }

    return divOrder;
}
var matriz_data_changed_det_klp = DataChangedDetailsKlipp();
function openContentKlipp(form, data){
    /* 
    function to open the nexts forms
    1.- Upload multiklipps
    2.- details  Klipp
    3.- all
    */
    var modal_details_klipp = $("#control-uploader-multiple-klipps");
    modal_details_klipp.parent().animate({ right: "580px" }, function () { });
    modal_details_klipp.parent().fadeIn(function(){
        // $(this).removeAttr("style");
    });
    switch (form) {
        case 'mult-klipps':
            var children =  $("#control-klipps-details").children().length;
            if(children > 0){
                $("#control-klipps-details").children().remove();
            }
            $("#control-uploader-multiple-klipps").fadeIn();
            break;
        case 'details-klipp':
            var display = $("#control-uploader-multiple-klipps").css("display");
            if(display == "block"){
                $("#control-uploader-multiple-klipps").fadeOut();
            }
            // $("#control-klipps-details").html(data.html);
            break;
        default:
            break;
    }
}

function closeContentKlipp(form){
    /* 
        function to open the nexts forms
        1.- Upload multiklipps
        2.- details  Klipp
        3.- all 
    */

    switch (form) {
        case 'mult-klipps':
            $("#control-uploader-multiple-klipps").fadeOut();
            var content = $("#control-uploader-multiple-klipps");
            content.removeAttr("style");
            $(".result-upload-file-multilple-klipps").html("");
            $("#upload-file-multiple-klipp input[type='file']").val(null);
            content.parent().fadeOut(function(){
                $(this).removeAttr("style");
            });

            break;
        case 'details-klipp':
        var modal_details_klipp = $("#control-klipps-details");
            modal_details_klipp.children().fadeOut(function () {
                modal_details_klipp.html("");
                modal_details_klipp.parent().removeAttr("style");
            });
            // control_klipps_details.html("");
            break;
        case "allViews": 
            $("#control-uploader-multiple-klipps").fadeOut();

            var content = $("#control-uploader-multiple-klipps");
            content.removeAttr("style");
            $(".result-upload-file-multilple-klipps").html("");
            $("#upload-file-multiple-klipp input[type='file']").val(null);
            
            var modal_details_klipp = $("#control-klipps-details");
                modal_details_klipp.children().fadeOut(function () {
                    modal_details_klipp.html("");
                    modal_details_klipp.parent().removeAttr("style");
                });

            break;
        default:
            break;
    }
}
/* functions for create klip */
function loadFormKLIPP(is_open_form_klipp, preselect) {
    if (!is_open_form_klipp) {
        /* Open */
        $.ajax({
            url: "/klaar/klipp/klipp/addklipp",
            type: 'GET',
            dataType: 'html',
            data: {},
            success: function (data, status) {
                jQuery('#control-klipps-global').html(data);
                // activeEventsOf(type_layout);
                eventsForCreateKLIPPS();
                setPreselectOnFormCreateKlipps(preselect);
                $.post("/klaar/klipp/klipp/ajaxHourAlert", {}, function(data){
                    // console.log(data);
                    if(data.status== 200){
                        var flag = data.response.flag;
                        var date = data.response.tmDate;

                        if(flag){
                            var note = "<strong>¡Advertencia!</strong> Los klipps creadas despues de las 17:00 hrs, será registrado con la fecha  de inicio: <span class='alert-link'> "+date+"</span>.";
                            $("#note-warning-create-klipp").fadeIn();
                            $("#note-warning-create-klipp").find(".alert").html(note);
                        }else{
                            $("#note-warning-create-klipp").fadeOut();
                        }
                    }
                }, 'json');
            }
        });
    } else {
        jQuery('#control-klipps-global').html("");
    }
}

function eventsForCreateKLIPPS() {
    $(".select_tipe li").on("click", function () {
        $(".select_tipe li").removeAttr("class");
        $(this).addClass("active");

        var value = $(this).data().value;

        viewFormKLIPP(value);

    });

    $("#show-more-inputs").on("click", function () {
        var form_is_hidden = $(this).data().form_is_hidden;

        if (form_is_hidden == 1) {
            $("#inputsgeneral").fadeIn();
            $(".listklipps").fadeOut();
            $(this).html("<i class='fa fa-toggle-up'></i>");
            $(this).data("form_is_hidden", 0);
            $("#direct_subdits").click();
        } else {
            $("#inputsgeneral").fadeOut();
            $(".listklipps").fadeIn();
            $(this).html("<i class='fa fa-toggle-down'></i>");
            $(this).data("form_is_hidden", 1);
        }
    });

    $("#create_simple_klipp").submit(function (event) {
        event.preventDefault();
        var name = $("input[name='title-klipp']").val();
        addFastKlipp(name);
    });

    $("#create_klipp_details").submit(function (event) {
        event.preventDefault();
        createKlipp(this);
    });

    $(".type_date").datepicker(
        { dateFormat: 'yy-mm-dd' });

    $("#addlink_dom-create-klipp").on("click", function () {
        var titulo = $("#title_link-create-klipp").val();
        var URL = $("#URL-create-klipp").val();
        if (titulo.trim() != "" && URL != "") {
            DOMaddURL(titulo, URL);
            $("#title_link-create-klipp").val('');
            $("#URL-create-klipp").val('');
            $("#title_link-create-klipp").focus();
        }
    });

    setJson();
    addOptionSelectFor("#area-create-klipp");
    // selectCategory();
    createSecctionCreateKlipp();
    /* Category */
    
    $("#category-create-klipp").on("change", function () {
        var position = $(this).val();
        // console.log(position);
        console.log($(this).val());
        buildCategory(position);
        /* if (position != -1 && position != -2) {
            buildCategory(position);
        }
        else if (position == -1) {
            buildCategory(null);
        } */
    });

    $("#project-create-klipp").on("change", function () {
        var id_project = $(this).val();
        if (id_project != 0) {
            addOptionForMilestone(id_project, "milestone-create-klipp");
        }
    });

    $("#area-create-klipp").on("change", function () {
        var type = $(this).attr("type");
        var value_this = $(this).val();
        if (value_this != -1) {
            addOptionForDepartament(value_this);
        }
        // addOptionSelectFor("#area");
    });
    /* Cleaning */
    $("#create_klipp_details input, #create_klipp_details select").on("change", function () {
        $("#create_klipp_details .result_form").html("");
    });

    $(".link-create-klipp-to-details").on("click", function () {
        var id_klipp = $(this).data().id_klipp;
        $(".link-create-klipp-to-details").removeClass("active");
        $(this).addClass("active");
        openAreaDetails(id_klipp);
    });
    $("a#link-open-multiple-klipp-uploader").on("click", function(event){
        event.preventDefault();
        var type = $("#switch_tipe li.active").data().value;
        
        openChargeMasiveKlippForm(type);
    });
    $("#close-klipp-mult-klipp").on("click", function(){
        // closeChargeMasiveKlippForm();
        closeContentKlipp("mult-klipps");
    });
    /* Open show all klipps of a project */
    $(".ad-klp-list-klipp-need-be-open").click();
}
function setPreselectOnFormCreateKlipps(preselect){
    console.log(preselect);
    
    if(preselect != ""){
        if(preselect.show_form){
            $("#show-more-inputs").click();
        }
        let data = preselect.preselect;
        $("#project-create-klipp").val(data.id_project).trigger("change");
    }
    /* Remove var preselect */
    $("#open-form-create-klipp").data("preselect", "");
}
/* == FUNCTIONS === */
var var_create_task = {
    links: []
};
var JSONGral = {
    areas: null,
    categorys: null
}

function viewFormKLIPP(form_to_show) {
    if (form_to_show == 0) {
        /* show block klipps */
        $("#inputs-for-user-direct").fadeIn();
        $("#inputs-for-users").fadeOut();
    } else {
        /* show block tickets */
        $("#inputs-for-users").fadeIn();
        $("#inputs-for-user-direct").fadeOut();
    }
}


function createKlipp(data_form) {
    var form_data = new FormData(data_form);
    var title_klipp = $("#create_simple_klipp input#title-create-klipp");
    var_create_task.isklipp = $("#switch_tipe li.active").data().value;
    var flag = true;

    title_klipp.removeAttr("style");
    $("#create_klipp_details .result_form").html("");
    $("#create_klipp_details select#area-create-klipp").removeAttr("style");

    if (var_create_task.isklipp == 1) {

        var select_area = $("select#area-create-klipp");

        id_area = select_area.val();
        id_depto = select_area.val();
        flag = id_area != -1 && id_depto != 0;
        if (flag) {
            form_data.append("id_area", id_area);
            form_data.append("id_depto", id_depto);
        } else {
            select_area.css({ border: "1px solid red" });
        }
    }

    if (title_klipp.val().trim() == "") {
        title_klipp.css({ border: "1px solid red" });
    }


    if (title_klipp.val().trim() != "" && flag) {
        form_data.append("is_ticket", $("#switch_tipe li.active").data().value);
        form_data.append("title", $("#create_simple_klipp input#title-create-klipp").val());
        form_data.set("description", $("#create_klipp_details input#description-create-klipp").val());
        form_data.append("deliverable", $("#create_klipp_details input#entregable-create-klipp").val());
        form_data.append("id_milestone", $("#create_klipp_details select#milestone-create-klipp").val());
        form_data.append("id_proyect", $("#create_klipp_details select#project-create-klipp").val());
        form_data.append("category", concactAllArrayCategory(combo_selector_array /* as all category */));
        form_data.set("start_date", $("#create_klipp_details input#start_date-create-klipp").val());
        form_data.set("finish_date", $("#create_klipp_details input#finish_date-create-klipp").val());
        form_data.append("links", getLinks());
        form_data.append("id_responsable", $("#create_klipp_details select#responsable-create-klipp").val());
        form_data.append("id_area", $("#create_klipp_details select#area-create-klipp").val());
        form_data.append("id_department", $("#create_klipp_details select#id_depto-create-klipp").val());
        form_data.append("id_vobo", $("#create_klipp_details select#vobo-create-klipp").val());

        $.ajax({
            url: "/klaar/klipp/klipp/ajaxCreateKlipp",
            type: "POST",
            data: form_data,
            dataType: "json",
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: function () {
                $("#create_klipp_details .result_form").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> creando ...</p>");
            },
            success: function (data) {
                console.log(" Get Data");
                switch (data.status) {
                    case 200:
                        $("#create_klipp_details .result_form").html("<p class='text-success text-right'><i class='fa fa-check-circle-o'></i> Creado creado correctamente</p>");
                        $("#create_klipp_details .link_precarged").html("");
                        setTimeout(() => {
                            $("create_klipp_details .result_form").children().fadeOut();
                        }, 3000);
                        $("#title").html("");
                        cleanFormCreateKLIPP();
                        break;
                    case 500:
                        $("#create_klipp_details .result_form").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error: </p>");
                        break;
                    default:
                        break;
                }
            },
            error: function (e) {
                $("#create_klipp_details .result_form").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error de conexión</p>");

            }
        });
    }

}


//  var json = ;

function addFastKlipp(name) {
    var title_klipp = $("#create_simple_klipp input#title-create-klipp");

    if (title_klipp.val().trim() != "") {
        // var_create_task.title = name;
        title_klipp.removeAttr("style");
        var data_create = {
            title: title_klipp.val()
        }
        /* ajaxFastCreateKlippAction */

        $.ajax({
            url: "/klaar/klipp/klipp/ajaxFastCreateKlipp",
            type: "POST",
            data: data_create,
            dataType: 'json',
            beforeSend: function () {
                $(".result_create_simple_klipp").html("<p class='text-success text-left'><i class='fa fa-spinner fa-spin'></i> creando ...</p>");
            },
            success: function (data) {
                // console.log(" Get Data");
                switch (data.status) {
                    case 200:
                        $(".result_create_simple_klipp").html("<p class='text-success text-left'><i class='fa fa-check-circle-o'></i> Creado creado correctamente</p>");
                        title_klipp.val("");
                        setTimeout(() => {
                            $(".result_create_simple_klipp").children().fadeOut();
                        }, 3000);
                        break;
                    case 500:
                        $(".result_create_simple_klipp").html("<p class='text-danger text-left'><i class='fa fa-close'></i> Error:" + data.error + " </p>");
                        break;
                    default:
                        break;
                }
            },
            error: function (e) {
                // $(".result_form").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error de conexión</p>");
            }
        });
    } else {
        title_klipp.css({ border: "1px solid red" });
    }
}
function cleanFormCreateKLIPP() {
    $("#create_simple_klipp input#title-create-klipp").val("");
    $("#create_klipp_details input#description-create-klipp").val("");
    $("#create_klipp_details input#entregable-create-klipp").val("");

    $("#create_klipp_details select#project-create-klipp").val(0);

    $("#create_klipp_details select#area-create-klipp").val(-1);
    $("#create_klipp_details input#files-create-klipp").val(null);
}
var iteraddklipp = 0;
function DOMaddURL(titulo, url) {

    var html = '<div class="list_links-create-klipp"> <p><b> Título: </b> <span class="title_link">' + titulo + '</span>, <b>URL: </b> <a class="url_link" href="' + url + '">' + url + ' </a>  </p>  <a class="btn btn-danger btn-sm erase_item" id="btn_link_added' + iteraddklipp + '"><i class="fa fa-trash"></i></a>  </div>';
    $(".link_precarged").append(html);

    $(".erase_item").on("click", function () {
        console.log("Helow");
        $(this).fadeOut(function () {
            $(this).parent().remove();
        });
    });
    iteraddklipp++;
}
function getLinks() {
    var links = [];
    $(".list_links-create-klipp").each(function () {
        var titulo = $(this).find(".title_link").text();
        var url = $(this).find(".url_link").text();
        links.push({ name: titulo, link: url });
    });
    links = JSON.stringify(links);
    console.log(links);
    return links;
}

function setJson() {
    JSONGral.areas = $("#areajson").data().areas;

    JSONGral.categorys = $("#categoryjson").data().category;
}

function addOptionSelectFor(element_select) {

    count = Object.keys(JSONGral.areas).length;
    $(element_select + " option").remove();

    $(element_select).append($('<option>', {
        value: -1,
        text: "Seleccionar Area"
    }));

    for (let i = 0; i < count; i++) {
        // console.log(JSONGral.areas);
        $(element_select).append($('<option>', {
            value: JSONGral.areas[i].id_area,
            text: JSONGral.areas[i].nombre_area
        }));
    }
}

function addOptionForDepartament(id_area) {
    count = Object.keys(JSONGral.areas).length;
    $("#id_depto-create-klipp  option").remove();
    /* $("#id_depto").append($('<option>', {
        value: 0,
        text: "Seleccionar Departamento"
    })); */
    for (let i = 0; i < count; i++) {

        if (JSONGral.areas[i].id_area == id_area) {
            var deptos = JSONGral.areas[i].deptos;
            // console.log(deptos);
            count_milestone = Object.keys(deptos).length;
            for (let j = 0; j < count_milestone; j++) {
                $("#id_depto-create-klipp").append($('<option>', {
                    value: deptos[j].id_depto,
                    text: deptos[j].nombre_depto
                }));
            }
            break;
        }
    }
}

function addOptionForMilestone(id_project, selector) {
    // console.log(id_project);
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxBringMilestonesFromProject",
        type: "POST",
        dataType: "json",
        data: { id_project: id_project },

        success: function (data) {
            console.log(" Get Data");
            switch (data.status) {
                case 200:
                    milestones = data.response;
                    $("#" + selector + " option").remove();
                    for (let i = 0; i < milestones.length; i++) {
                        $("#" + selector + "").append($('<option>', {
                            value: milestones[i].id_milestone,
                            text: milestones[i].name
                        }));
                    }
                    if(milestones.length == 0){
                        $("#" + selector + "").append($('<option>', {
                            value: 0,
                            text: "S/Milestone"
                        }));
                    }
                    is_waiting_milestone? updateKlippDetails(): "";

                    is_waiting_milestone = false;
                    break;
                case 500:
                    alert(data.error);
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            alert("Error de conexión");
        }
    });
}

var combo_selector_array= [];
function CategoryBuild(selector, data, val_root){
    
    let category = {};
    
    category.json = data;
    category.selector = selector;
    category.is_root = true;
    category.cat_build = [val_root];
    category.current_json = null;
    category.level_temp = null;
    category.historic = [];
    category.is_last_child = false;

    category.execute = function(value){
        if(value != null && value != -2 && value != -1){
            this.build(value);
            this.drawPrettyCategory();
        }else if(value == -1){

            let hist_lngt = this.historic.length;
            if(this.is_last_child){
                value = this.historic[ hist_lngt - 2].id_father;
                this.historic.pop();
                this.historic.pop();
                this.is_last_child = false;
                this.cat_build.pop();
            }else{
                value = this.historic[ hist_lngt - 1].id_father;
                this.historic.pop();
                this.cat_build.pop();
            }
            this.drawPrettyCategory();
        }
        let data = this.searchChild(value);
        
        if(data.length != 0){
            this.drawOption(data);
            this.current_json = data;
            this.is_last_child = false;

        }else{
            this.is_last_child = true;
        }

        if(value == null || this.is_root){
            this.is_root = false;
        }
    }

    category.searchChild = function(value){
        // console.log("searchChild: "+value);
        
        if(value === undefined || value == null || value == 0){
            // console.log("Estamos en root, reiniciando");
            this.is_root = true;
            return this.json;
        }else{
            // let val = val;
            let data_found = [];
            let search = function(data){
                let array_is_find = false;
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if(element.value == value){
                        array_is_find = true;
                        data_found = element.child;
                        return 1;
                    }
                }
                if(!array_is_find){
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        search(element.child);    
                    }
                }
            }
            search(this.json);
            return data_found;
        }
    }

    category.drawOption = function(data){
        $("#"+selector).find("option").remove();
        $("#"+selector).append($("<option>", {val: -2, text: "Seleccionar"}));

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let option = $("<option>", {val: element.value, text: element.label});
            $("#"+selector).append(option);
        }
        
        if(!this.is_root){
            $("#"+selector).append($("<option>", {val: -1, text: "N/A"}));
        }
    }
    category.build = function(value){

        let child = null;
        for (let index = 0; index < this.current_json.length; index++) {
            const element = this.current_json[index];
            if(element.value == value){
                child = {
                    level: element.level,
                    value: element.value,
                    label: element.label,
                    id_father: element.id_father
                };
                break;
            }
        }
        
        let child_hist = {level: child.value, id_father : child.id_father, updated : false};
        let level_found = false;
        for (let index = 0; index < this.cat_build.length; index++) {
            const element = this.cat_build[index];
            if(element.level == child.level){
                this.cat_build[index] = child;
                child_hist.updated = true;
                level_found = true;
                this.historic[index-1] = child_hist;
                break;
            }
        }

        if(!level_found){
            this.cat_build.push(child);
            this.historic.push(child_hist);
        }

        this.level_temp = child.level;
        // console.log("this.cat_build: ");
        // console.log(this.cat_build);
        // console.log("=== END Building Category ====");
    }

    category.drawPrettyCategory = function(){

        var parent =  $("#"+this.selector).parent();

        var dom_to_print = parent.find(".ct-draw-cr-klp");
        let concat_label = "";
        if(this.cat_build.length > 1){
            for (let index = 1; index < this.cat_build.length; index++) {

                concat_label += this.cat_build[index].label;

                if(index !=  this.cat_build.length-1){
                    concat_label += " / ";
                }
            }
        }
        dom_to_print.html(concat_label);
    }

    category.getCategoryBuilded = function(){
        return this.cat_build;
    }

    category.execute(null);
    return category;
}
function createSecctionCreateKlipp(){
    var categorys = JSONGral.categorys;
    var count  = Object.keys(categorys).length;

    for (let i = 0; i < count; i++) {
        var id_ctn_form_group = "ctn-section-form-cr-kl" + i;

        var form_group_customize = $("<div>", {class: "form-group customize_form_group", id: id_ctn_form_group});

        var label = $("<label>", {text: categorys[i].label + ": ", class: "col-form-label"});

        var select = $("<select>", {
            class: "form-control customize_input",
            id:"category-section-create-klp" + i,
            "data-id_selector": i
        });
        var div_to_print_ctgry = $("<div>", {class: "ct-draw-cr-klp text-info", id:"" });

        var ctn_section = $(".categorys-ctn-cre-klp");
            ctn_section.append(form_group_customize);
        
        var form_group = $("#" + id_ctn_form_group);
            form_group.append(label);
            form_group.append(select);
            form_group.append(div_to_print_ctgry); // print_categoryn

        var child = categorys[i].child;

        var selectors_section = "category-section-create-klp" + i;

        /* $("#"+selectors_section).append($('<option>', {
            value: -2,
            text: "Seleccionar"
        }));
        
        var next_array = [];
        for (let index = 0; index < child.length; index++) {

            $("#"+selectors_section).append($('<option>', {
                value: index,
                text: child[index].label,
            }));

            next_array.push(child[index].child);

        } */
        var val_root = {
                position: 1,
                level: 1,
                value: categorys[i].value,
                id_category_section: categorys[i].id_category_section,
                label: categorys[i].label
        };

        var categorys_build = CategoryBuild(selectors_section, child, val_root);
        // categorys_build.selectCategory();
        combo_selector_array.push({build_category: categorys_build, position: i});

        $("#"+selectors_section).on("change", function(){
            var value = $(this).val();
            var id_selector = $(this).data().id_selector;
            console.log(id_selector);
            id_selector = parseInt(id_selector);
            combo_selector_array[id_selector].build_category.execute(value);
        });
    }
}

function convertCategoryInString(category){
    var concat_string = "";
    // console.log(category);
    if(category.length != 1){
        for (let index = category.length-1; index >= 0 ; index--) {
            var data =  category[index];
            // console.log(data);
            if(index == category.length-1){
                var firstchild = '"child": {"level": '+data.level+',"value": '+data.value+', "label": "'+data.label+'", "child": null }';
                concat_string += firstchild;
            }
            else if(index == 0){
                var root =  '{"position": '+data.position+',"level": '+data.level+',"value": '+data.value+', "id_category_section": '+data.id_category_section+', "label": "'+data.label+'",';
                concat_string = root + concat_string  + "}"; 
            }else{
                var child = '"child": {"level": '+data.level+',"value": '+data.value+', "label": "'+data.label+'",';
                concat_string = child + concat_string + "}";
            }
        }
    }else{
        var data = category[0];
        concat_string =  '{"position": '+data.position+', "label": "'+data.label+'", "level": '+data.level+', "value": '+data.value+', "id_category_section": '+data.id_category_section+', "child": null }';
    }
    return concat_string;
}

function concactAllArrayCategory(allsection){

    var string_final = "[";

    for (let index = 0; index < allsection.length; index++) {
        
        var cat = allsection[index];
        var cat_array  = cat.build_category.getCategoryBuilded();

        var string = convertCategoryInString(cat_array);

        string_final = string_final +  string ;

        if(index != allsection.length -1 ){
            string_final = string_final + ",";
        }
    }
    string_final = string_final + "]"; 

    return string_final;
}

var child_found = null;
function findSectionCategory (array_category, id_section, selectors_section){
    child_found = null;
    for (let index = 0; index < array_category.length; index++) {
        var data = array_category[index];
        if(data.id_category_section == id_section){
            recursiveReadCategory(data, selectors_section);
            break;
        }
    }
    return child_found;
}

var auxiliar_iteracion_recursive = 0;
function recursiveReadCategory(child, selectors_section){
    // console.log("Clickeando Joven");
    if(auxiliar_iteracion_recursive != 0){
        // console.log("Clickeando", child.label);
        //var  value_select = $("#"+selectors_section+" option:contains('"+child.label+"')").val()
        $("#"+selectors_section).val(child.value).trigger("change");
    }
    if(child.child === null || child.child  === undefined){
        child_found = child;
        // console.log("Finalizando recursividad");
        
        auxiliar_iteracion_recursive = 0;
        return 1;
    }else{
        auxiliar_iteracion_recursive ++;
        var child = child.child;
        recursiveReadCategory(child, selectors_section);
    }
}

/* End function for KLIPPS */

/* function details KLIPP */
function openAreaDetails(id_klipp) {
    openContentKlipp("details-klipp", null);
    $.ajax({
        url: "/klaar/klipp/klipp/detailsklipp/" + id_klipp,
        type: 'GET',
        dataType: 'html',
        data: {},
        beforeSend: function () {
            $("#control-klipps-details").html("<h2> <i class='fa fa-spinner fa-spin'></i> Cargando ... </h2>");
        },
        success: function (data, status) {
            jQuery('#control-klipps-details').html(data);
            // activeEventsOf(type_layout);
            activateDetailsKlippEvents();
        }
    });
}

function activateDetailsKlippEvents() {
    /* Actions for  details KLIPP */
    $("#close-klipp-details").on("click", function () {
        console.log("Hola Mundo");
        closeContentKlipp("details-klipp");
    });
    /* form */
    $("form#assign_hour_status_klipp_details").on("submit", function (event) {
        event.preventDefault();
        $("#s-h-status-klipp-details").removeAttr("style");
        $("#hour_status-klipp-details").removeAttr("style");
        var status = $("#s-h-status-klipp-details").val();
        var hour = $("#hour_status-klipp-details").val();
        var text_hour = $("#s-h-status-klipp-details option:selected").text();
        hour = parseFloat(hour);
        if (hour.length != 0 && status != 0 && hour <= 8.0 && hour > 0.5) {
            console.log("Helow");
            var id_klipp = $("#header-box-klipp-details").data().id_klipp;
            addStatusHistoricalKlippDetails(status, hour, id_klipp, text_hour);
        } else {
            status == 0 ? $("#s-h-status-klipp-details").css({ "border": "1px solid red" }) : "";
            !(hour <= 8.0 && hour > 0.5) ? $("#hour_status-klipp-details").css({ "border": "1px solid red" }) : "";
        }
    });

    $("form#form-save-observer-klipp").on("submit", function (event) {
        event.preventDefault();
        console.log("form-save-observer-klipp");

        var user_id = $("#user-id-details-klipp").val();
        var profile_id = $("#profile-id-details-klipp").val();
        if (user_id != 0 && profile_id != 0) {
            var user_name = $("#user-id-details-klipp option:selected").text();
            var profile_name = $("#profile-id-details-klipp option:selected").text();
            user_name = user_name.split("-");
            user_name = user_name[0];
            var data_names = {
                user_name: user_name,
                profile_name: profile_name
            };
            addObserverKlippDetails(user_id, profile_id, data_names);
        } else {
            alert("No ha elegido el usuario o el perfil ");
        }
    });

    /* End actions details */
    $("#upload_file-klipp-details").on("submit", function (event) {
        event.preventDefault();
        var dom_input_file = $("#name_file_details_to_edit");
        dom_input_file.removeAttr("style");
        var dom_input_tipe_file = $("#tipe_file_details_to_edit");
        dom_input_tipe_file.removeAttr("style");

        if (dom_input_file.val() != '' && dom_input_tipe_file.val() != 0) {
            var form_data = new FormData(this);
            uploadFileKlippDetails(form_data);
        }

        if (dom_input_file.val() == '') {
            dom_input_file.css({ border: "1px solid red" });
        }

        if (dom_input_tipe_file.val() == 0) {
            dom_input_tipe_file.css({ border: "1px solid red" });
        }
    });
    $(".erase-logic-file-klipp-details").on("click", function () {
        var target = this;
        deleteDomBoxFileKlippDetails(target);
    });

    $("#send_message-klipp-details").on("submit", function (event) {
        event.preventDefault();
        var user_name = $("input#user_name-klipp-details").val();
        var message = $("input#message_user-klipp-details").val();
        var photo = $("input#img_user-klipp-details").val();
        var sent_time = $("input#sent_time").val();
        $("input#message_user-klipp-details").removeAttr("style");
        if (message != '') {
            sendMessageKlippDetails(user_name, message, photo, sent_time);
        }
        else {
            $("input#message_user-klipp-details").css({ border: "1px solid red" });
        }
    });
    /* Actions for details */
    $("#id_project_details_to_edit").on("change", function () {
        var id_project = $(this).val();
        if (id_project != 0) {
            addOptionForMilestone(id_project, "id_milestone_details_to_edit");
        }
    });

    $("input.edit-to-update-details-klipp").on("change", function () {
        updateKlippDetails();
        $(this).addClass("inpt-was-changed-dtl-klp");
    });
    $("select.edit-to-update-details-klipp").on("change", function () { 
        $(this).addClass("inpt-was-changed-dtl-klp");
        if($(this).attr("id") == "id_project_details_to_edit"){
            // $("")
            is_waiting_milestone = true;
        }else{
            updateKlippDetails();
        }
     });
    $("#id_status_details_to_edit").on("change", function(){
        $(this).addClass("inpt-was-changed-dtl-klp");
        let status = $(this).val();
        if(status == 7){
            survey_klipp_inst.id_status = status;
            // console.log(survey_klipp_inst);
            $("#klipp-details-questions-tab").click(); 
        }else{
            var data = {
                id: status,
                name: $(this).find("option:selected").text()
            };
            updateStatusKlp(data);
        }
    });
    $("textarea.edit-to-update-details-klipp").on("change", function () { updateKlippDetails() });


    $("a.edit-observer-details").on("click", function (event) {
        event.preventDefault();
        eventEditRowObserver(this);
    });


    $("button.update-observer-klipp-details").on("click", function () {
        eventUpdateRowObserver(this);
    });

    $("button.cancel-update-observer-klipp-details").on("click", function () {
        eventCancelRowObserver(this);
    });

    $("a.delete-observer-details").on("click", function (event) {
        event.preventDefault();
        eventDeleteRowObserver(this);
    });

    /* add links */
    $("#add-link-to-detail-klipp").on("submit", function () {
        event.preventDefault();
        var title = $("#title_link_details_to_edit").val();
        var url = $("#url_link_details_to_edit").val();

        $("#title_link_details_to_edit").removeAttr("style");
        $("#url_link_details_to_edit").removeAttr("style");

        if (title.trim() != "" && url.trim() != "") {
            var id_klipp = $("#header-box-klipp-details").data().id_klipp;

            addNewLinkToKlippDetails(title, url, id_klipp);
        }

        if (title.trim() == "") {
            $("#title_link_details_to_edit").css({ border: "1px solid red" });
        }
        if (url.trim() == "") {
            $("#url_link_details_to_edit").css({ border: "1px solid red" });
        }
    });
    $(".erase-logic-link-klipp-details").on("click", function () {
        deleteDomBoxLinkKlippDetails(this);
    });
    $("#start_date_details_to_edit ,#finish_date_details_to_edit").datepicker();
    
    $('a#klipp-details-files-tab').on('shown.bs.tab', function (e) {
        fitNameFilesUploadedDetails(null);
        let sorteable_files = OrderDivs();
        sorteable_files.classSorteable = ".sorteable_files";
        sorteable_files.classElement = ".ctn-files-dt-klp";

        $("#type-order-file-klipp-details").on("change", function(){
            console.log("click en ordenar");
            switch ($(this).val()) {
                case "1":
                    sorteable_files.asc("date");
                    break;
                case "2":
                    sorteable_files.desc("date");
                    break;
                case "3":
                    sorteable_files.asc("weight");
                    break;
                case "4":
                    sorteable_files.desc("weight");
                    break;
                default:
                    break;
            }
        });
        
    });
    $('a#klipp-details-ta-links-tab').on('shown.bs.tab', function (e) {
        let sorteable_links = OrderDivs();
            sorteable_links.classSorteable = ".sorteable_links";
            sorteable_links.classElement = ".box-link-dt-klp";
            $("#type-order-links-klipp-details").on("change", function(){
                switch ($(this).val()) {
                    case "1":
                        sorteable_links.asc("date");
                        break;
                    case "2":
                        sorteable_links.desc("date");
                        break;
                    default:
                        break;
                }
            });
    });

    $("#view-mode-files-klp").on("click", function(){
        let icon = "";
        console.log("Click on filesss");
        switch ($(this).data().mode) {
            case 'list':
                $(".ctn-files-dt-klp").removeClass("col-sm-6 col-md-6");
                $(".ctn-files-dt-klp").addClass("col-sm-12 col-md-12");
                $(this).data("mode", "square")    
                icon = '<i class="fa  fa-th"></i>';
                break;
            case 'square':
                $(".ctn-files-dt-klp").removeClass("col-sm-12 col-md-12");
                $(".ctn-files-dt-klp").addClass("col-sm-6 col-md-6");
                $(this).data("mode", "list");
                icon = '<i class="fa fa-list"></i>';
                break;
            default:
                break;
        }
        $(this).html(icon);
    });

    $("#view-mode-klipps-lnk-klp").on("click", function(){
        console.log("-- REDIMENSIONANDO LINKS == ");
        let icon = "";
        switch ($(this).data().mode) {
            case 'list':
                $(".box-link-dt-klp").removeClass("col-sm-6 col-md-4");
                $(".box-link-dt-klp").addClass("col-sm-12 col-md-12");
                $(this).data("mode", "square")    
                icon = '<i class="fa  fa-th"></i>';
                break;
            case 'square':
                $(".box-link-dt-klp").removeClass("col-sm-12 col-md-12");
                $(".box-link-dt-klp").addClass("col-sm-6 col-md-4");
                $(this).data("mode", "list");
                icon = '<i class="fa fa-list"></i>';
                break;
            default:
                break;
        }
        $(this).html(icon);
    });
    
    
    $("a#klip-details-messages-tab").on('shown.bs.tab', function (e) {
        var id_klipp = $("#header-box-klipp-details").data().id_klipp;
        // setMessageAsRead(id_klipp);
        $(".content_messages_for_details_klipp").animate({scrollTop: $(".all_messages").height()});        
    });
    
    $("a#klipp-details-ta-links-tab").on('shown.bs.tab', function (e) {
        fitNameLinksDetails(null);
    });
    combo_selector_det_klp = []; // restaurando el array de las categorías.
    drawCategorySectionDetKlp(); // draw all category
    setCategoriesDetailsKlp(); // update category on details
    $("#edit-category-details-klipp").on("click", function(){
        editCategoryDetailsKlipp();
    });
    $("#save-category-details-klipp").on("click", function(){
        updateCategoryKlippDetails(); 
    });
    /*  */
    $("#btn-solicite-survey-klp-details").on("click", function(){
        let id_klipp = $("#header-box-klipp-details").data().id_klipp;
        SurveyKlipp().solicite(id_klipp);
    });
    $(".star-det-klp").on("click", function(){
        var value = $(this).data().value;
        var parent_star = $(this).parent();
        if(!$(this).hasClass("locker-star-dt-klp")){
            drawStarDtlKlp(value, parent_star);
            parent_star.data("value", value);
        }
    });
    $("#send-survey-det-klp").on("click", function(){

        let id_klipp = $("#header-box-klipp-details").data().id_klipp;
        survey_klipp_inst.id_klipp = id_klipp;
        survey_klipp_inst.dom_question = $(".select-star-det-klp");
        survey_klipp_inst.dom_question_open = $(".question-opened-det-klp");
        survey_klipp_inst.saveAnswers();

    });
}

var survey_klipp_inst = SurveyKlipp();

///////////////////////////////////////////////////////////////////////////////////////////

var html_string_message = '<div class="direct-chat-msg chat-custmize-emitter right"><img class="direct-chat-img" src="{{link_foto}}" alt="Message User Image"><div class="direct-chat-text customize-chat-primary"><p class="direct-chat-name font-italic">{{name_user}}</p><p class="message-cstz">{{message}}</p><p class="direct-chat-timestamp text-right text-italic">{{sent_time}}</p></div></div>';

var html_string_row_observer = '<tr data-id_user = "{{ id_user }}"  id="{{ id_row_observer }}" data-id_observer="{{ id_observer }}"  data-id_profile = {{ id_profile }} data-name_profile = "{{ name_profile }}"><td class="name-observer-details"><span>{{ user_name }}</span></td><td class="profile-observer-details"><select name="" id="" class="form-control profile-observer-select-klipp-details">{{ select_profile }}</select><span>{{ name_profile_row }}</span></td><td class="text-right"><button class="btn update-observer-klipp-details btn-success" ><i class="fa fa-save"></i> Guardar</button> <button class="btn cancel-update-observer-klipp-details btn-danger" ><i class="fa fa-close"></i> Cancelar</button><div class="btn-group custmize-width"><button type="button" class="btn btn-success">Acciones</button><button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="edit-observer-details"><i class="fa fa-pencil"></i>Editar</a></li><li><a href="#" class="delete-observer-details"><i class="fa fa-trash"></i>Eliminar</a></li></ul></div></td></tr>';

var html_string_link_details_klipp = '<div class="col-sm-6 col-md-4" id="{{id_box}}" data-date="{{ date_added_ref }}"> <div class="panel panel-default"> <button class="pull-right btn btn-sm btn-danger erase-logic-link-klipp-details" data-id_link = "{{ id_link }}"><i class="fa fa-trash"></i> Borrar</button> <div class="panel-body"> <div class="row"> <div class="col-md-12"> <div class="txt-c-p-y tool-tipp"> <div class="txt-f-p-rpor"> <div class="txt-f-p-txt text-18" title="{{ name_klipp_title }}"> {{ name_klipp }} </div> </div> </div> </div> </div> <p> <b></b><a href="{{ url_link }}" target="_blank">Link</a> <br> <b></b>{{ full_name_user }} <p class="pull-right date-upload-file_details_file">{{ date_added }}</p> </p> </div> </div> </div>';
var html_string_files_details_klipp = '<div id="{{ id_box }}" class="col-sm-6 col-md-6 ctn-files-dt-klp" data-date="{{date_uploaded_ord}}" data-weight = "{{ file_weight_ord }}"> <div class="panel panel-default"> <button class="pull-right btn btn-sm btn-danger erase-logic-file-klipp-details" data-id_file= "{{ id_file }}"><i class="fa fa-trash"></i> Borrar</button> <div class="panel-body"> <div class="row"> <div class="col-md-12"> <div class="txt-c-p-y tool-tipp"> <div class="txt-f-p-rpor"> <div class="txt-f-p-txt text-18" title="{{ name_file_title }}"> {{ name_file }} </div> </div> </div> </div> </div> <p class="txt-details-file-klipp"> <b>Tipo archivo: </b> {{ file_tipe }} <br> <b>Usuario: </b> {{ user_uploaded }} <br> <b>Peso: </b> {{ file_weight }} <p class="pull-right date-upload-file_details_file"> {{date_uploaded}}</p> </p> </div> <div class="download-file-ctn"> <a href="/klaar/klipp/klipp/ajaxViewFile/{{ id_file_link }}" download target="_blank" class="btn btn-primary"><i class="fa fa-download"></i></a> </div> </div> </div>';
;

var iteration_files_upload_klipp_details = 0;
function domFilesKlippDetails(date_uploaded, file_weight, user_uploaded, file_tipe, name_file, id_file) {
    //{{ id_file }}, {{ name_file }}, {{ file_tipe }}, {{ user_uploaded }}, {{ file_weight }}, {{date_uploaded}}
// {{date_uploaded_ord}}, {{ file_weight_ord }}, {{ name_file_title }}
    DOM_html_string_file = html_string_files_details_klipp.replace("{{date_uploaded}}", date_uploaded);
    DOM_html_string_file = DOM_html_string_file.replace("{{date_uploaded_ord}}", date_uploaded);
    DOM_html_string_file = DOM_html_string_file.replace("{{ file_weight }}", file_weight);
    DOM_html_string_file = DOM_html_string_file.replace("{{ file_weight_ord }}", file_weight);
    DOM_html_string_file = DOM_html_string_file.replace("{{ user_uploaded }}", user_uploaded);
    DOM_html_string_file = DOM_html_string_file.replace("{{ file_tipe }}", file_tipe);
    DOM_html_string_file = DOM_html_string_file.replace("{{ name_file }}", name_file);
    DOM_html_string_file = DOM_html_string_file.replace("{{ name_file_title }}", name_file);
    DOM_html_string_file = DOM_html_string_file.replace("{{ id_file }}", id_file);
    DOM_html_string_file = DOM_html_string_file.replace("{{ id_file_link }}", id_file);
    DOM_html_string_file = DOM_html_string_file.replace("{{ title_name_file }}", name_file);
    
    DOM_html_string_file = DOM_html_string_file.replace("{{ id_box }}", "box-file-klipp-details" + iteration_files_upload_klipp_details);

    $("#content-all-files-for-this-details-klipp").append(DOM_html_string_file);

    fitNameFilesUploadedDetails("#box-file-klipp-details" + iteration_files_upload_klipp_details+ " .name-file-uploaded-klipp");

    $("#box-file-klipp-details" + iteration_files_upload_klipp_details + " .erase-logic-file-klipp-details").on("click", function () {
        var target = this;
        deleteDomBoxFileKlippDetails(target);
    });

    iteration_files_upload_klipp_details++;

}

function fitNameFilesUploadedDetails(selector_recent){
    console.log("helow -------");
    
    if(selector_recent == null){
        $(".name-file-uploaded-klipp").each(function(){
            console.log("OKI");
            
            var width = $(this).find(".name-file").width();
            console.log();
            
            if(width > 220){
                $(this).find(".name-file").addClass("short-name");
                $(this).find(".three-points").css({display: "inline-block"});
                $(this).find(".name-file").tooltip();
            }
        });
    }else{
        
        var width = $(selector_recent).find(".name-file").width();
            console.log();
            
        if(width > 220){
            $(selector_recent).find(".name-file").addClass("short-name");
            $(selector_recent).find(".name-file").tooltip();
            $(selector_recent).find(".three-points").css({display: "inline-block"});
            
        }
    }
}

function fitNameLinksDetails(selector_recent){
    if(selector_recent == null){
        $(".name-link-uploaded-klipp").each(function(){
            var width = $(this).find(".name-link").width();
            if(width > 138){
                $(this).find(".name-link").addClass("short-name");
                $(this).find(".three-points-link").css({display: "inline-block"});
                $(this).find(".name-link").tooltip();
            }
        });
    }else{
        
        var width = $(selector_recent).find(".name-link").width();
            
        if(width > 220){
            $(selector_recent).find(".name-link").addClass("short-name");
            $(selector_recent).find(".name-link").tooltip();
            $(selector_recent).find(".three-points-link").css({display: "inline-block"});
            
        }
    }
}

function deleteDomBoxFileKlippDetails(target) {
    var id_file = $(target).data().id_file;
    var box_file = $(target).parent().parent();
    var ok = confirm("¿Estas seguro de eliminarlo?");
    if (ok) {
        deleteLogicFileKlippDetails(box_file, id_file);
    }
}
function setMessageAsRead(id_klipp){
    $.post("/klaar/klipp/test/ajaxtest", {id_klipp: id_klipp}, function(data){
        console.log("mensaje leido");
    });
}
function uploadFileKlippDetails(form_data) {
    /* Subir Archivo */

    form_data.append("id_klipp", $("#header-box-klipp-details").data().id_klipp);
    
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxUploadFile",
        type: "POST",
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        dataType: 'json',
        beforeSend: function () {
            $(".result-action-for-files-klipp-details").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Subiendo ...</p>");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    $(".result-action-for-files-klipp-details").html("<p class='text-success text-right'><i class='fa  fa-check-circle'></i> Archivo agregado </p>");
                    var user_uploaded = $("#user-to-upload-file-klipp-details").val();
                    var file_tipe = $("#tipe_file_details_to_edit option:selected").text();
        
                    domFilesKlippDetails(data.response[0].creation_date, data.response[0].size, user_uploaded, file_tipe, data.response[0].name, data.response[0].id_file);
                    setTimeout(() => {
                        $(".result-action-for-files-klipp-details *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    $("#name_file_details_to_edit").val(null);
                    $("#tipe_file_details_to_edit").val(0);

                    break;
                case 500:
                    $(".result-action-for-files-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error:"+data.message+" </p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-action-for-files-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error, consulte con el administrador</p>");
        }
    });
}
function deleteLogicFileKlippDetails(selector_to_delete, id_file) {
    var data = {
        id_file: id_file
    }
    console.log(data);
    
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxLogicDeleteFile",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-action-for-files-klipp-details").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Eliminando ...</p>");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    $(".result-action-for-files-klipp-details").html("<p class='text-success text-right'><i class='fa fa-trash'></i> Archivo eliminado </p>");
                    selector_to_delete.fadeOut(function () { $(this).remove() });
                    setTimeout(() => {
                        $(".result-action-for-files-klipp-details *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    break;
                case 500:
                    $(".result-action-for-files-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error: "+data.response+"</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-action-for-files-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error,  consulte con el administrador</p>");
        }
    });
}

function domMessages(name, message, photo, sent_time) {
    DOM_html_string_message = html_string_message.replace("{{name_user}}", name);
    DOM_html_string_message = DOM_html_string_message.replace("{{message}}", message);
    DOM_html_string_message = DOM_html_string_message.replace("{{sent_time}}", sent_time);
    DOM_html_string_message = DOM_html_string_message.replace("{{link_foto}}", photo);

    $(".all_messages").append(DOM_html_string_message);
    
    $(".content_messages_for_details_klipp").animate({scrollTop: $(".all_messages").height()});
    // $(".content_messages_for_details_klipp").scrollTop($(".all_messages").height());

}


function sendMessageKlippDetails(name, message, photo, sent_time) {
    $("#btn_send_msgs").html("enviando");
    $("#btn_send_msgs").prop("disabled", true);
    var data = {
        name: name,
        message: message,
        id_klipp: $("#header-box-klipp-details").data().id_klipp
    }
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxSendMessage",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $("#btn_send_msgs").html("<i class='fa fa-spinner fa-spin'></i>  Enviando ...");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    domMessages(name, message, photo, data.response.creation_date);
                    $("#btn_send_msgs").html("<i class='fa fa-send'></i>  Enviar");
                    $("#btn_send_msgs").prop("disabled", false);
                    $("input#message_user-klipp-details").val('');
                    $(".result-action-send-message-klipp-details *").fadeOut(function () { $(this).remove() });
                    break;
                case 500:
                    $("#btn_send_msgs").html("<i class='fa fa-send'></i>  Enviar");
                    $(".result-action-send-message-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error: "+data.message+"</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-action-send-message-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error,  consulte con el administrador</p>");
            $("#btn_send_msgs").html("<i class='fa fa-send'></i>  Enviar");
        }
    });
}

var dom_link_box_klipp_details = 0;
function domLinkDetailsKLIPP(name_klipp, url, full_name, date, id_link) {
    // , , , , 
    DOM_html_link_klipp_details = html_string_link_details_klipp.replace("{{ name_klipp }}", name_klipp);
    DOM_html_link_klipp_details = DOM_html_link_klipp_details.replace("{{ name_klipp_title }}", name_klipp);
    DOM_html_link_klipp_details = DOM_html_link_klipp_details.replace("{{ url_link }}", url);
    DOM_html_link_klipp_details = DOM_html_link_klipp_details.replace("{{ full_name_user }}", full_name);
    DOM_html_link_klipp_details = DOM_html_link_klipp_details.replace("{{ date_added }}", date);
    DOM_html_link_klipp_details = DOM_html_link_klipp_details.replace("{{ date_added_ref }}", date);
    DOM_html_link_klipp_details = DOM_html_link_klipp_details.replace("{{ id_link }}", id_link);
    DOM_html_link_klipp_details = DOM_html_link_klipp_details.replace("{{id_box}}", "dom_box_link_klipp-details" + dom_link_box_klipp_details);

    $("#content-links-for-details").append(DOM_html_link_klipp_details);

    $("#dom_box_link_klipp-details" + dom_link_box_klipp_details + " .erase-logic-link-klipp-details").on("click", function () {
        var target = this;
        deleteDomBoxLinkKlippDetails(target);
    });

    dom_link_box_klipp_details++;
}

function deleteDomBoxLinkKlippDetails(target) {
    var id_link = $(target).data().id_link;
    var box_link = $(target).parent().parent();
    var ok = confirm("¿Estas seguro de eliminarlo?");
    if (ok) {
        deleteLogicLinkKlippDetails(box_link, id_link);
    }
}

function deleteLogicLinkKlippDetails(selector_to_delete, id_link) {
    var data = {
        id_link: id_link
    }

    $.ajax({
        url: "/klaar/klipp/klipp/ajaxLogicDeleteLink",
        type: "POST",
        data: data,
        beforeSend: function () {
            $(".result-actions-for-link-klipp-details").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Eliminando ...</p>");
        },
        success: function (data) {
            $(".result-actions-for-link-klipp-details").html("<p class='text-success text-right'><i class='fa fa-trash'></i> Link eliminado </p>");
            selector_to_delete.fadeOut(function () { $(this).remove() });
            setTimeout(() => {
                $(".result-actions-for-link-klipp-details *").fadeOut(function () { $(this).remove() });
            }, 3000);
            switch (data.status) {
                case 200:
                    $(".result-actions-for-link-klipp-details").html("<p class='text-success text-right'><i class='fa-check-circle-o'></i> Creado creado correctamente</p>");
                    break;
                case 500:
                    $(".result-actions-for-link-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error: </p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-actions-for-link-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error de conexión</p>");
        }
    });
}
function addNewLinkToKlippDetails(name_klipp, url, id_klipp) {
    var link = [];

    link.push({
        name: name_klipp,
        link: url
    });

    var data = {
        links: JSON.stringify(link),
        id_klipp: id_klipp
    }
    console.log(data);
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxCreateLink",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-actions-for-link-klipp-details").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Agregando ...</p>");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    $(".result-actions-for-link-klipp-details").html("<p class='text-success text-right'><i class='fa fa-check-circle-o'></i> Link agregado </p>");
                    var full_name = $("#name-user-klipp-details").val();
                    domLinkDetailsKLIPP(name_klipp, url, full_name, data.response[0].creation_date, data.response[0].id_link); // date_example id_link example 8,
                    $("#title_link_details_to_edit").val('');
                    $("#url_link_details_to_edit").val('');
                    setTimeout(() => {
                        $(".result-actions-for-link-klipp-details *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    break;
                case 500:
                    $(".result-actions-for-link-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error:" + data.error + " </p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-actions-for-link-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error consulte con el administrador</p>");
        }
    });
}

function drawStarDtlKlp(value, parent_star){
    var type_star = "";
    value = parseInt(value);
    for (let index = 1; index <= 5; index++) {
        if(index <= value){
            type_star = "<i class='fa fa-star text-yellow'></i>"
        }
        else{
            type_star = "<i class='fa fa-star-o'></i>"
        }
        parent_star.find(".star-det-klp[reference='"+index+"']").html(type_star);
    }
    parent_star.parent().removeAttr("style");
    parent_star.parent().find(".txt-required-det-klp").text("");
}

function SurveyKlipp(id_klipp){
    let survey = {};
    survey.id_klipp = id_klipp;
    survey.dom_question = $(".select-star-det-klp");
    survey.dom_question_open = $(".question-opened-det-klp");
    survey.id_status = null;
    survey.solicite = function(id_klipp){
        this.sendServer("solicite", {id_klipp: id_klipp});
    }

    survey.checkQuestionHasAnswer = function(){

        let ok = true;
        // let border_danger = {borderBottom: "1px solid red"};

        this.dom_question.parent().removeAttr("style");
        this.dom_question.each(function(){
           let data = $(this).data(); 
            console.log(data);
           if(data.optional == 0 && data.value == 0){
                $(this).parent().find(".txt-required-det-klp").text("(Obligatorio)");
                let parent = $(this).parent();
                
                ok = false;
           }
        });
        this.dom_question_open.each(function(){
            let input = $(this).find("input");
            let data = input.data();
            console.log(data);
            if(data.optional == 0 && input.val().trim() == ""){
                $(this).parent().find(".txt-required-det-klp").text("(Obligatorio)");
                ok = false;
            }
        });

        return ok;
    },
    survey.saveAnswers = function(){
        let data = {};
        if(this.checkQuestionHasAnswer()){
            data.id_klipp = this.id_klipp;
            data.status = this.id_status;
            let answers = [];
            
            this.dom_question.each(function(){
                let ans = $(this).data();
                answers.push({"id_question": ans.question, "answers": ans.value});
            });

            this.dom_question_open.find("input").each(function(){
                let ans = $(this).data();
                answers.push({"id_question": ans.question, "answers": $(this).val()});
            });

            data.answers = answers;
            let ok = confirm("¿Estás seguro de continuar?");

            if(ok){
                this.sendServer("save", data);
            }
        }
    }

    survey.sendServer = function(type, data){
        let url = null;
        let selector_dom = null;
        switch (type) {
            case 'save':
                url  = "/klaar/klipp/klipp/ajaxNpsSaveAnswers";
                selector_dom = ".rst-survey-det-klp"
                break;
            case 'solicite':
                url  = "/klaar/klipp/klipp/ajaxNpsSolNps";
                selector_dom = ".btn-to-solite-survey" 
                break;
            default:
                break;
        }
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            dataType: 'json',
            beforeSend: function () {
                $(selector_dom).html("<p class='text-success text-center'><i class='fa fa-spinner fa-spin'></i> Enviando ...</p>");
            },
            success: function (data) {
                switch (data.status) {
                    case 200:
                        $(selector_dom).html("<p class='text-success text-center'><i class='fa fa-check-circle-o'></i> Se ha realizado con exito. </p>");

                        (type == "save") ? $("#send-survey-det-klp").prop("disabled", true) : "";
                        (type == "solicite") ? $(selector_dom).html("Encuesta Solicitada !!") : "";
                        
                        setTimeout(() => {
                            $(selector_dom+" *").fadeOut(function () {
                                $(this).remove() ;
                                (type == "solicite") ? $(selector_dom).html("Encuesta Solicitada !!") : "";
                            });
                        }, 3000);
                        disableCategoryDetailsKlipp();
                        break;
                    case 500:
                        $(selector_dom).html("<p class='text-danger text-center'><i class='fa fa-close'></i> Error: "+data.message+"</p>");
                        break;
                    default:
                        break;
                }
            },
            error: function (e) {
                $(selector_dom).html("<p class='text-warning text-center'><i class='fa fa-close'></i> Error, consulte con el administrador</p>");
            }
        });
    }

    return survey;
}
/* function for details TAB */

function editCategoryDetailsKlipp(btn_edit){
    $("#save-category-details-klipp").fadeIn();
    $("#edit-category-details-klipp").fadeOut();
    $(".edit-cat-det-klp").prop("disabled", false);
    // selectCategoryDetKlp();
}
function disableCategoryDetailsKlipp(){
    $("#save-category-details-klipp").fadeOut();
    $("#edit-category-details-klipp").fadeIn();
    $(".edit-cat-det-klp").prop("disabled", true);
}
function updateCategoryKlippDetails() {
    // console.log("Guardando categrías");
    var data = {
        "category": concactAllArrayCategory(combo_selector_det_klp /* as all category */),
        "id_klipp" : $("#header-box-klipp-details").data().id_klipp
    }
    // console.log(data);
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxUpdateCategory",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-update-klipp-details").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Actualizando ...</p>");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    $(".result-update-klipp-details").html("<p class='text-success text-right'><i class='fa fa-check-circle-o'></i> Categpría actualizada. </p>");
                    setTimeout(() => {
                        $(".result-update-klipp-details *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    disableCategoryDetailsKlipp();
                    break;
                case 500:
                    $(".result-update-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error: "+data.message+"</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-update-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error, consulte con el administrador</p>");
        }
    });
}

var is_waiting_milestone = false;

function updateStatusKlp(status) {
    console.log("Actualizando Cambios");
    let id_klipp = $("#header-box-klipp-details").data().id_klipp;
    var data = {
        id_klipp : id_klipp,
        status: status.id,
    }
    
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxupdateklippstatus",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-update-klipp-details").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Actualizando ...</p>");
        },
        success: function (data) {
            
            switch (data.status) {
                case 200:
                    $(".result-update-klipp-details").html("<p class='text-success text-right'><i class='fa fa-check-circle-o'></i> Actualizado </p>");
                    matriz_data_changed_det_klp.setData(null);
                    applyChangesListKlp(status, id_klipp);
                    setTimeout(() => {
                        $(".result-update-klipp-details *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    $("#header-box-klipp-details").data("has_been_changed", 1);
                    break;
                case 500:
                    $(".result-update-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error: "+data.message+"</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-update-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error, consulte con el administrador</p>");
        }
    });
}
function applyChangesListKlp(status, id_klipp){
    if(status != undefined){
        if(status.id == 6){
            let content_details = $("#klipp-details");
            content_details.find("input").prop("disabled", true);
            content_details.find("select").prop("disabled", true);
            content_details.find("textarea").prop("disabled", true);
            let element_klip = $(".link-create-klipp-to-details[data-id_klipp='"+id_klipp+"']");
            element_klip.fadeOut(function(){$(this).remove()});
        }
        let bckg =  array_label_color[status.id];
        let dom_status = $("#status_klp_string");
        dom_status.html(status.name);
        dom_status.removeAttr("class");
        dom_status.addClass("label label st_klp_"+bckg);
    }
}
function updateKlippDetails() {
    console.log("Actualizando Cambios");
    var data = {
        id_klipp : $("#header-box-klipp-details").data().id_klipp,
        title: $("input#title_details_to_edit").val(),
        description: $("textarea#description_details_to_edit").val(),
        start_date: $("input#start_date_details_to_edit").val(),
        finish_date: $("input#finish_date_details_to_edit").val(),
        deliverable: $("input#entregable_details_to_edit").val(),
        id_proyect: $("select#id_project_details_to_edit").val(),
        id_milestone: $("select#id_milestone_details_to_edit").val(),
        // status: $("select#id_status_details_to_edit").val(),
    }
    // console.log(data);

    $.ajax({
        url: "/klaar/klipp/klipp/ajaxUpdateKlippInfo",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-update-klipp-details").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Actualizando ...</p>");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    $(".result-update-klipp-details").html("<p class='text-success text-right'><i class='fa fa-check-circle-o'></i> Actualizado </p>");
                    matriz_data_changed_det_klp.setData(null);
                    setTimeout(() => {
                        $(".result-update-klipp-details *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    $("#header-box-klipp-details").data("has_been_changed", 1);
                    break;
                case 500:
                    $(".result-update-klipp-details").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error: "+data.message+"</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-update-klipp-details").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error, consulte con el administrador</p>");
        }
    });
}
function addStatusHistoricalKlippDetails(id_status, hour, id_klipp, text_hour) {
    var data = {
        id_klipp: id_klipp,
        id_type_hour: id_status,
        hours: hour
    }

    $.ajax({
        url: "/klaar/klipp/klipp/ajaxAssignHours",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-assign-hour-details-klipp").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Asignando ...</p>");
        },
        success: function (data) {
            console.log(" Get Data");
            switch (data.status) {
                case 200:
                    var fecha = data.response.creation_date;
                    var tipe_label = (id_status == 1)? "info" : "primary";
                    var tr = "<tr><td>" + hour + "Hrs</td><td> <span>" + fecha + "</span> <span class='label label-"+tipe_label+"'>"+text_hour+"</span></td></tr>";
                    $("#body-historical-status-details-klipp").append(tr);
                    $(".result-assign-hour-details-klipp").html("<p class='text-success text-right'><i class='fa fa-check-circle'></i> Asignado </p>");
                    var current_val = $("#total_hor_for_details_klipp").val();
                    $("#s-h-status-klipp-details").val(0);
                    $("#hour_status-klipp-details").val('');
                    hour = parseInt(hour);
                    current_val = parseInt(current_val);
                    $("#total_hor_for_details_klipp").val((current_val+hour));
                    setInterval(() => {
                        $(".result-assign-hour-details-klipp *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    break;
                case 500:
                    $(".result-assign-hour-details-klipp").html("<p class='text-success text-right'><i class='fa fa-close'></i>" + data.error + "</p>");
                    alert("Error: " + data.error);
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-assign-hour-details-klipp").html("<p class='text-success text-right' title='Contacte con su administrador'><i class='fa fa-close'></i> Ha ocurrido un error</p>");
        }
    });
}
function changeToInputDOM(rowDOM) {

    var cell_profile = rowDOM.find(".profile-observer-details");

    cell_profile.find(".profile-observer-select-klipp-details").fadeIn();
    cell_profile.find("span").css({ "display": "none" });

    rowDOM.find(".update-observer-klipp-details").css({ "display": "inline-block" });
    rowDOM.find(".cancel-update-observer-klipp-details").css({ "display": "inline-block" });
    rowDOM.find(".btn-group.custmize-width").css({ "display": "none" });

}
function restoreRowProfile(rowDOM) {
    console.log(rowDOM.data());
    var cell_profile = rowDOM.find(".profile-observer-details");

    cell_profile.find(".profile-observer-select-klipp-details").css({ "display": "none" });
    cell_profile.find("span").css({ "display": "block" });
    cell_profile.find("span").text(rowDOM.data().name_profile);

    rowDOM.find(".update-observer-klipp-details").css({ "display": "none" });
    rowDOM.find(".cancel-update-observer-klipp-details").css({ "display": "none" });
    rowDOM.find(".btn-group.custmize-width").css({ "display": "inline-block" });

}
function updateUserObserver(id_klipp, id_observer, id_user, id_permition, status, data_row) {
    var data = {
        id_klipp: id_klipp,
        id_user: id_user,
        id_user_permition: id_observer,
        id_permition: id_permition,
        status: status,
    }
    console.log(data);
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxUpdateProfile",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-action-for-observer-klipp").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Actualizando observador ...</p>");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    var tr = data_row.tr;
                    tr.data("name_update", data_row.user_name);
                    tr.data("name_profile", data_row.profile_name);
                    tr.data("id_profile", id_permition);
                    restoreRowProfile(tr);
                    $(".result-action-for-observer-klipp").html("<p class='text-success text-right'><i class='fa  fa-check-circle'></i> Observador actualizado</p>");
                    setTimeout(() => {
                        $(".result-action-for-observer-klipp *").fadeOut(function () { $(this).remove(); });
                    }, 3000);
                    break;
                case 500:
                    $(".result-action-for-observer-klipp").html("<p class='text-danger text-right'><i class='fa  fa-check-circle'></i> Error: "+data.message+ "</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-action-for-observer-klipp").html("<p class='text-danger text-right'><i class='fa  fa-check-circle'></i> Error, consulte con el administrador</p>");
        }
    });
}

var tr_observer_to_delete_klipp = null;
function deleteLogicObserverKlippObserver(id_observer, id_klipp, id_user, id_permition) {
    var data = {
        id_klipp: id_klipp,
        id_user_permition: id_observer,
        id_user: id_user,
        id_permition: id_permition,
        status: $("#id_status_details_to_edit").val()
    }
    
    console.log(data);
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxLogicDeleteProfile",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-action-for-observer-klipp").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Eliminando ...</p>");
        },
        success: function (data) {

            switch (data.status) {
                case 200:
                    tr_observer_to_delete_klipp.fadeOut(function () { $(this).remove });

                    $(".result-action-for-observer-klipp").html("<p class='text-success text-right'><i class='fa fa-trash'></i> Se eliminado el observador </p>");
                    setTimeout(() => {
                        $(".result-action-for-observer-klipp *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    break;
                case 500:
                    $(".result-action-for-observer-klipp").html("<p class='text-success text-right'><i class='fa fa-close'></i>Error: " + data.message + "</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            alert("Error de conexion");
        }
    });
}
function addObserverKlippDetails(user_id, profile_id, data_names) {
    var data = {
        id_klipp: $("#header-box-klipp-details").data().id_klipp,
        id_user: user_id,
        id_permition: profile_id,
        status: $("#id_status_details_to_edit").val()
    }
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxAddProfile",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-add-new-observer-klipp").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Agregando ...</p>");
        },
        success: function (data) {
            console.log(" Get Data");
            switch (data.status) {
                case 200:
                    $(".result-add-new-observer-klipp").html("<p class='text-success text-right'><i class='fa fa-check-circle-o'></i> Observador agregado </p>");
                    setTimeout(() => {
                        $(".result-add-new-observer-klipp *").fadeOut(function () { $(this).remove() });
                    }, 3000);
                    var id_user_permition = data.response;
                    addRowObserverInTableDOM(id_user_permition, profile_id, data_names, user_id);
                    break;
                case 500:
                    $(".result-add-new-observer-klipp").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error:"+data.message+"</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-add-new-observer-klipp").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error del servidor, contacte con el administrador</p>");
        }
    });
}
var id_events_row_observer_iter = 0;
function addRowObserverInTableDOM(id_user_permition, profile_id, data_names, id_user) {
    var id_event = "row-observer" + id_events_row_observer_iter;
    // {{ id_user_permition }}, {{ id_user }}

    DOM_html_string_observer = html_string_row_observer.replace("{{ id_row_observer }}", id_event);
    DOM_html_string_observer = DOM_html_string_observer.replace("{{ id_observer }}", id_user_permition); // id_permition
    DOM_html_string_observer = DOM_html_string_observer.replace("{{ id_profile }}", profile_id);
    DOM_html_string_observer = DOM_html_string_observer.replace("{{ user_name }}", data_names.user_name);
    DOM_html_string_observer = DOM_html_string_observer.replace("{{ name_profile }}", data_names.profile_name);
    DOM_html_string_observer = DOM_html_string_observer.replace("{{ name_profile_row }}", data_names.profile_name);

    DOM_html_string_observer = DOM_html_string_observer.replace("{{ id_user }}", id_user);

    var select_profile = $("#list-observers-klipp-details tr:nth-child(1)").find(".form-control.profile-observer-select-klipp-details").clone().html();
    console.log(select_profile);
    DOM_html_string_observer = DOM_html_string_observer.replace("{{ select_profile }}", select_profile);

    /* Events */
    $("#list-observers-klipp-details").append(DOM_html_string_observer);
    $("#" + id_event + " .edit-observer-details").on("click", function (event) {
        event.preventDefault();
        var target = this;
        eventEditRowObserver(target);
    });
    $("#" + id_event + " .delete-observer-details").on("click", function (event) {
        event.preventDefault();
        var target = this;
        eventDeleteRowObserver(target);
    });

    $("#" + id_event + " .update-observer-klipp-details").on("click", function (event) {
        event.preventDefault();
        var target = this;
        eventUpdateRowObserver(target);
    });

    $("#" + id_event + " .cancel-update-observer-klipp-details").on("click", function (event) {
        event.preventDefault();
        console.log("cancelar actualización");
        var target = this;
        eventCancelRowObserver(target);
    });
}

function eventEditRowObserver(target) {
    var row = $(target).parent().parent().parent().parent().parent();
    changeToInputDOM(row);
}
function eventDeleteRowObserver(target) {
    var row = $(target).parent().parent().parent().parent().parent();
    tr_observer_to_delete_klipp = row;
    var id_observer = row.data().id_observer; /*  as id_user_permition */

    var ok = confirm("¿Seguro que desea quitar este observador?");
    if (ok) {
        var id_klipp = $("#header-box-klipp-details").data().id_klipp;
        var id_user = row.data().id_user;
        var id_permition = row.data().id_profile; /* as id permition */
        deleteLogicObserverKlippObserver(id_observer, id_klipp, id_user, id_permition);
    }
}
function eventUpdateRowObserver(target) {
    var tr = $(target).parent().parent();
    var id_permition = tr.find(".profile-observer-select-klipp-details").val();
    var id_observer = tr.data().id_observer;
    var id_user = tr.data().id_user;
    var id_klipp = $("#header-box-klipp-details").data().id_klipp;
    var status = $("#id_status_details_to_edit").val();
    
    var user_name = tr.find(".user-observer-select option:selected").text();
    var profile_name = tr.find(".profile-observer-select-klipp-details option:selected").text();
    var data_names = { user_name: user_name, profile_name: profile_name, tr: tr };
    
    updateUserObserver(id_klipp, id_observer, id_user, id_permition, status, data_names);
}

function eventCancelRowObserver(target) {
    var tr = $(target).parent().parent();
    restoreRowProfile(tr);
}
var combo_selector_det_klp = [];

function drawCategorySectionDetKlp(){
    var jsons_data = $(".ctn-categories-details-klip").data();
    var categorys = jsons_data.category_json;
    
    
    var count  = Object.keys(categorys).length;

    for (let i = 0; i < count; i++) {
        var id_ctn_form_group = "ctn-section-form-det-klp" + i;

        var form_group_customize = $("<div>", {class: "form-group", id: id_ctn_form_group});

        var label = $("<label>", {text: categorys[i].label + ": ", class: "col-form-label"});

        var select = $("<select>", {
            class: "form-control input-sm edit-cat-det-klp", // los imputs con esta clase estan ocultas hasta que se editen
            id:"category-section-details-klp" + i,
            "data-id_selector": i,
            disabled: true
        });
        var div_to_print_ctgry = $("<div>", {class: "ct-draw-cr-klp text-info for-details-klp", id:"" });

        var ctn_section = $(".ctn-categories-details-klip");
            ctn_section.append(form_group_customize);
        
        var form_group = $("#" + id_ctn_form_group);
            form_group.append(label);
            form_group.append(select);
            form_group.append(div_to_print_ctgry); // print_categoryn

        var child = categorys[i].child;

        var selectors_section = "category-section-details-klp" + i;

        /*$("#"+selectors_section).append($('<option>', {
            value: -2,
            text: "Seleccionar"
        }));
        
        var next_array = [];
        for (let index = 0; index < child.length; index++) {

            $("#"+selectors_section).append($('<option>', {
                value: index,
                text: child[index].label,
            }));
            next_array.push(child[index].child);
        } */
        
        var val_root = {
                position: 1,
                level: 1,
                value: categorys[i].value,
                id_category_section: categorys[i].id_category_section,
                label: categorys[i].label
        };

        var categorys_build = CategoryBuild(selectors_section, child, val_root);
        combo_selector_det_klp.push({build_category: categorys_build, position: i});

        $("#"+selectors_section).on("change", function(){
            var value = $(this).val();
            var id_selector = $(this).data().id_selector;
            // console.log(id_selector);
            id_selector = parseInt(id_selector);
            // console.log(value);
            // console.log(combo_selector_det_klp[id_selector].build_category);
            combo_selector_det_klp[id_selector].build_category.execute(value);
        });

        

        /* var select_pre_category = $("<select>", {
            class: "form-control cat-category-saved", // los selects con esta clase cat-category-saved esta abiertos hasta que se editen.
            id:"se-with-categry-saved" + i,
        });

        form_group.append(select_pre_category);

        $("#se-with-categry-saved" + i).append($("<option>", {text: child_preselect.label})); */

        /* si tiene valores precargados */
    }
}

function setCategoriesDetailsKlp(){
    var jsons_data = $(".ctn-categories-details-klip").data();
    var current_category =  jsons_data.current_category;
    var categorys = jsons_data.category_json;
    var count  = Object.keys(categorys).length;
    // console.log("Cargando las cateorias ===========");
    for (let index = 0; index < count; index++) {
        var selectors_section =  "category-section-details-klp" + index;
        findSectionCategory(current_category, categorys[index].id_category_section, selectors_section);
    }
    // console.log("Fin de carga de categorias =======");
}
/* End functions for details */
/* Init functions for chargeMasive */
var flag_is_ticket_for_mult_klipp = null;
function openChargeMasiveKlippForm(type){
    flag_is_ticket_for_mult_klipp = type;
    type++;
    console.log(type);
    $("#download-template-xls-multiple-klipp").attr("href", "/klaar/klipp/klipp/ajaxViewFile/" + type);
    openContentKlipp("mult-klipps", null);
    /*var modal_details_klipp = $("#control-uploader-multiple-klipps");
    modal_details_klipp.parent().animate({ right: "580px" }, function () { });*/
    // $("#control-uploader-multiple-klipps").fadeIn();
    // closeDetailsView();
}

function closeChargeMasiveKlippForm(){
    /* var content = $("#control-uploader-multiple-klipps");
    content.fadeOut("style");
    $(".result-upload-file-multilple-klipps").html("");
    $("#upload-file-multiple-klipp input[type='file']").val(null);
    content.parent().fadeOut(function(){
        $(this).removeAttr("style");
    }); */
}

function uploadFileMultipleKlipps(form_data){
    $.ajax({
        url: "/klaar/klipp/klipp/massiveuploaderklipp",
        type: "POST",
        data: form_data,
        dataType: "html",
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function () {
            $(".result-upload-file-multilple-klipps").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Subiendo ...</p>");
        },
        success: function (data) {
            $(".result-upload-file-multilple-klipps").html(data);
            activateEventsFileUploaded();
        },
        error: function (e) {
            $(".result-upload-file-multilple-klipps").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error, consulte con el administrador</p>");
        }
    });
}
var is_select_all_input_mult_klipp = false;
function activateEventsFileUploaded(){
    $("#edit-klipp-select-up-mult").on("click").on("click", function(){
        $(".ctn-modal-up-mult").fadeIn();
        writeOnInputFormEditKlipp();
    });
    
    $("#delete-klipp-select-up-mult").on("click").on("click", function(){
        var ok = confirm("¿Estás seguro de eliminarlos?");
        if(ok){
            deleteKlippsMultKlipp();
        }
    });
    
    $("#tb-list-multiple-klipps td.check_mult_klipp input").on("click", function(){
        togglesSelectedRowMultKlipp(this);
    });
    $("#tb-list-multiple-klipps tr td.check_mult_klipp").on("click", function(){$(this).find("input").click()});
    console.log("Abriendo formulario");
    
    $(".select-all-mult-klipp").on("click", function(){
        var tr = $(this).parent().parent().parent().find("tbody").find("tr");
        tr.each(function(){
            var check_box = $(this).find("input");
            if(is_select_all_input_mult_klipp){
                check_box.is(":checked") ? check_box.click() : "";
            }else{
                check_box.is(":checked") ? "" : check_box.click();
            }
        });
        if(is_select_all_input_mult_klipp){
            $(this).find("h3").html("<i class='fa fa-square-o'></i>");
        }else{
            $(this).find("h3").html("<i class='fa fa-check-square'></i>");
        }
        is_select_all_input_mult_klipp = !is_select_all_input_mult_klipp;
    });
    $("#input-start-date-up-mult-klp, #input-finish-date-up-mult-klp").datepicker(
        { dateFormat: 'yy-mm-dd' });

    $("#input-project-up-mult-klp").html($("#project-create-klipp").clone().html());
    $("#input-area-up-mult-klp").html($("#area-create-klipp").clone().html());

    $("#input-area-up-mult-klp").on("change", function(){
        var id_area = $(this).val();
        addOptionForDepartamentMultKlipp(id_area, null);
    });
    $("#input-project-up-mult-klp").on("change", function(){
        var id_project = $(this).val();
        setMilestoneFormEditMultKLIPP(id_project, "input-milestone-up-mult-klp", null);
    });

    $("#edit-klipp-select-up-mult").prop("disabled", true);
    $("#delete-klipp-select-up-mult").prop("disabled", true);

    $("#user-id-mult-klipp").html($("#responsable-create-klipp").clone().html());

    /* Observer */
    
    
    $("#btn-add-observer-mult-klipp").on("click", function(){
        var id_user = $("#user-id-mult-klipp").val();
        var id_permition = $("#profile-id-mult-klipp").val();
        var user = $("#user-id-mult-klipp option:selected").text();
        var permition = $("#profile-id-mult-klipp option:selected").text();
        $("#user-id-mult-klipp, #profile-id-mult-klipp").removeAttr("style");
        $(".result-add-obs-mult-klp").html("");
        if(id_user != -1 && id_permition != 0){
            if(!hasPerfilResponsableMultKlp(id_user, id_permition)){
                addNewObserverMultKlipp(id_user, id_permition, user, permition);
                $("#user-id-mult-klipp").val(-1);
                $("#profile-id-mult-klipp").val(0);
            }else{
                $(".result-add-obs-mult-klp").html("<p class='text-danger'><i class='fa fa-close'></i> No se pudo agregar, el perfil ya existe</p>");
            }
        }
        if(id_user == -1){
            $("#user-id-mult-klipp").css({borders: "1px solid red"});
        }
        if(id_permition == 0){
            $("#profile-id-mult-klipp").css({borders: "1px solid red"});
        }
    });

    addProfileOnSelectMultKlipp();

    $("#save-list-on-server-mult-klipp").on("click", function(){
        
        var data =  buildStructureKlippToSave();
        // console.log(data.klipps);
        if(!data.hasError){
            saveKlippMassiveKipp(data.klipps);
        }else{
            $(".result-error-upload-mult-klipps")
                .html("<p class='text-danger text-right'><i class='fa fa-close'></i> Los klipps con errores no se pueden subir, eliminalos o editalos e intentalo de nuevo.</p>");
        }
    });
    $("#cancel-form-uploader-list-mult-klipp").on("click", function(){
        $(".result-upload-file-multilple-klipps *, .result-error-upload-mult-klipps *").fadeOut(function(){$(this).remove()});
    });
}

function saveKlippMassiveKipp(data){
    var data =  {"klipps": data}
    $.ajax({
        url: "/klaar/klipp/klipp/ajaxCreateKlippsMassive",
        type: "POST",
        data: data,
        dataType: 'json',
        beforeSend: function () {
            $(".result-error-upload-mult-klipps").html("<p class='text-success text-right'><i class='fa fa-spinner fa-spin'></i> Subiendo Klipps ...</p>");
        },
        success: function (data) {
            switch (data.status) {
                case 200:
                    $(".result-error-upload-mult-klipps").html("");
                    $(".result-upload-file-multilple-klipps").html("<div class='text-success text-center'><h2> <i class='fa fa-check-circle-o'></i></h2> Cargado correctamente</div>");
                    /* setTimeout(() => {
                        $(".result-upload-file-multilple-klipps *").fadeOut(function () { $(this).remove() });
                    }, 3000); */
                    break;
                case 500:
                    $(".result-error-upload-mult-klipps").html("<p class='text-danger text-right'><i class='fa fa-close'></i> Error:"+data.message+"</p>");
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            $(".result-error-upload-mult-klipps").html("<p class='text-warning text-right'><i class='fa fa-close'></i> Error del servidor, contacte con el administrador</p>");
        }
    });

}
function addProfileOnSelectMultKlipp(){
    var profiles = $("#tb-list-multiple-klipps").data().profile_observer;
    $("#profile-id-mult-klipp option").remove();
    var option = $("<option>", {
        value: "0",
        text: "Seleccionar"
    });
    $("#profile-id-mult-klipp").append(option);

    for (let index = 0; index < profiles.length; index++) {
        var option = $("<option>", {
            value: profiles[index].id_permition,
            text: profiles[index].name
        });
         
        $("#profile-id-mult-klipp").append(option);
    }
}
function closeFormEditMultKlipp(){
    $(".ctn-modal-up-mult").fadeOut(function(){
        $(this).removeAttr("style");
    });
    $("#input-start-date-up-mult-klp").val('');
    $("#input-finish-date-up-mult-klp").val('');
    $("#input-project-up-mult-klp").val(0);
    $("#input-area-up-mult-klp").val(-1);
    $("#input-milestone-up-mult-klp").val("-1");
    $("#input-entregable-up-mult-klp").val('');
    $("#input-title-up-mult-klp").val('');
    $("#input-descrip-up-mult-klp").val('');
    $("#body-list-user-profile-mult-klipp").html("");

    $("#inputs-for-edit-mult-klipp input, #input-project-up-mult-klp, #input-milestone-up-mult-klp, #tb-list-profile-mult-klpp, #input-depto-up-mult-klp, #input-area-up-mult-klp").removeClass("has-been-modified");
}
function togglesSelectedRowMultKlipp(element_check){
    
    var tr = $(element_check).parent().parent();
    if(tr.hasClass("selected")) {
        tr.removeClass("selected");
        tr.find("h4").html("<i class='fa fa-square-o'></i>");
    }else{
        tr.find("h4").html("<i class='fa fa-check-square-o'></i>");
        tr.addClass("selected");
    }
    var total_selected =  $("table#tb-list-multiple-klipps tr.selected").length;

    (total_selected > 0)? $("#edit-klipp-select-up-mult").prop("disabled", false): $("#edit-klipp-select-up-mult").prop("disabled", true);
    (total_selected > 0)? $("#delete-klipp-select-up-mult").prop("disabled", false): $("#delete-klipp-select-up-mult").prop("disabled", true);
}

function writeOnInputFormEditKlipp(){
    var selected =  $("table#tb-list-multiple-klipps tr.selected");
    var selector = "table#tb-list-multiple-klipps tr.selected";
    if(selected.length == 1){
        var data = $(selected).data();
        console.log(data);
        $("#input-entregable-up-mult-klp").val(data.deliverable);
        $("#input-title-up-mult-klp").val(data.title);
        $("#input-descrip-up-mult-klp").val(data.description);
        drawProfileForFormEditMultKLipp(selector);

        if(flag_is_ticket_for_mult_klipp ==0 ){ // for klipp
            $("#input-start-date-up-mult-klp").val(data.start_date);
            $("#input-finish-date-up-mult-klp").val(data.finish_date);
            if(data.start_date.trim() == ""){
                $("#input-start-date-up-mult-klp").datepicker().datepicker("setDate", new Date());
            }
            if(data.finish_date.trim() == ""){
                $("#input-finish-date-up-mult-klp").datepicker().datepicker("setDate", new Date());
            }
            $("#input-milestone-up-mult-klp").val(-1);
            if(data.id_proyect != 0){
                $("#input-project-up-mult-klp").val(data.id_proyect);
                setMilestoneFormEditMultKLIPP(data.id_proyect, "input-milestone-up-mult-klp", data.id_milestone);
            }
        }
        if(flag_is_ticket_for_mult_klipp == 1){

            if(data.id_area != 0){
                $("#input-area-up-mult-klp").val(data.id_area);
                addOptionForDepartamentMultKlipp(data.id_area, data.id_department);
            }
        }
        // addOptionForMilestone(id_project,"input-milestone-up-mult-klp");
    }
    if(flag_is_ticket_for_mult_klipp == 0){
        /* Is klipp */
        $("#for-klip-form-mult-klipp").fadeIn();
        $("#input-for-klp-mult-klipp-dates").fadeIn();
        $("#for-ticket-form-mult-klipp").fadeOut();
    }
    if(flag_is_ticket_for_mult_klipp == 1){
        /* is ticket */
        $("#input-for-klp-mult-klipp-dates").fadeOut();
        $("#for-klip-form-mult-klipp").fadeOut();
        $("#for-ticket-form-mult-klipp").fadeIn();
    }

    $("#inputs-for-edit-mult-klipp input, #input-project-up-mult-klp, #input-milestone-up-mult-klp, #input-area-up-mult-klp, #input-depto-up-mult-klp").on("change", function(){
        var target = $(this);
        if(!target.hasClass("has-been-modified")){
            target.addClass("has-been-modified");
        }
    });
}

function setMilestoneFormEditMultKLIPP(id_proyect, selector, id_milestone){
    $("#" + selector + " option").remove();
    $("#" + selector + "").append($('<option>', {
        value: -1,
        text: "Seleccionar"
    }));

    $.ajax({
        url: "/klaar/klipp/klipp/ajaxBringMilestonesFromProject",
        type: "POST",
        dataType: "json",
        data: { id_project: id_proyect },
        success: function (data) {
            switch (data.status) {
                case 200:
                    milestones = data.response;

                    for (let i = 0; i < milestones.length; i++) {
                        
                        $("#" + selector + "").append($('<option>', {
                            value: milestones[i].id_milestone,
                            text: milestones[i].name
                        }));
                        if(milestones[i].id_milestone == id_milestone){
                            $("#"+selector+" option[value='"+id_milestone+"']").prop("selected", true);
                            if(!$("#" + selector + "").hasClass("has-been-modified")){
                                $("#" + selector + "").addClass("has-been-modified");
                            }
                        }
                    }

                    if(milestones.length == 0){
                        $("#" + selector + "").append($('<option>', {
                            value: 0,
                            text: "S/Milestone"
                        }));
                    }
                    break;
                case 500:
                    alert(data.error);
                    break;
                default:
                    break;
            }
        },
        error: function (e) {
            alert("Error, consulte con el servidor");
        }
    });
}
function deleteKlippsMultKlipp(){
    var rows = $("table#tb-list-multiple-klipps tr.selected");
    rows.fadeOut(function(){$(this).remove()});
}
// save klipp in this table
function saveDataLogicForKlipp(){
    console.log("============ GUARDANDO ======");
    var row_selected = $("table#tb-list-multiple-klipps tr.selected");
    $("#inputs-for-edit-mult-klipp .has-been-modified").each(function(){
        var name = $(this).data().name;
        row_selected.data(name, $(this).val());
        var data_tr = $(row_selected).data();
        console.log(data_tr);
        switch (name) {
            case 'start_date':
                $(row_selected).find(".start-date-mas-mult-klp").html(data_tr.start_date);
                break;
            case 'finish_date':
                $(row_selected).find(".finish-date-mas-mult-klp").html(data_tr.finish_date);
                break;
            case 'title':
                $(row_selected).find(".title-mas-mult-klp").html(data_tr.title);
                break;
            case 'description':
                $(row_selected).find(".descr-mas-mult-klp").html(data_tr.description);
                break;
            case 'deliverable':
                $(row_selected).find(".entregable-mas-mult-klp").html(data_tr.deliverable);
                break;
            default:
                break;
        }
    });

    var table_observer = $("#tb-list-profile-mult-klpp");
    if(table_observer.hasClass("has-been-modified")){
        console.log("Guardando permisos, ok ok.");
        drawObsrvrOnTableMultKlp();
        $(row_selected).data("allpermition", getAllObserverMultKlipp());
    }

    $(row_selected).removeClass("text-danger");
    $(row_selected).data("has_error", "0");

    $(row_selected).find(".error-mas-mult-klp").html("");
    $("#body-list-user-profile-mult-klipp").html("");
    closeFormEditMultKlipp();
    console.log("=================== FIN GUARDAR ==============");
}
var iteration_del_us_mult_klipp = 0;
function addNewObserverMultKlipp(id_user, id_permition, user, permition){
    var table = $("#tb-list-profile-mult-klpp");
    user = user.split("-");
    var email = user[1];
    user = user[0];
    var tr = '<tr data-email = "'+email+'" data-user="'+user+'" data-permition = "'+permition+'" data-id_user = '+id_user+' data-id_permition= '+id_permition+'><td>'+user+'</td><td>'+permition+'</td><td class="text-center"><button id="delte-us-obs-mult-klp'+iteration_del_us_mult_klipp+'" class="btn btn-danger btn-xs delete-usr-mult-klp"><i class="fa fa-trash"></i></button></td></tr>'; 
    $("#body-list-user-profile-mult-klipp").append(tr);
    $("#delte-us-obs-mult-klp"+iteration_del_us_mult_klipp).on("click", function(){
        deleteObsrMultKlipp(this);
    });

    if(!table.hasClass("has-been-modified")){
        table.addClass("has-been-modified");
    }
    iteration_del_us_mult_klipp ++;
}

function deleteObsrMultKlipp(target){
    var table = $("#tb-list-profile-mult-klpp");
    $(target).parent().parent().fadeOut(function(){
        $(this).remove();
        if(!table.hasClass("has-been-modified")){
            table.addClass("has-been-modified");
        }
    });
}
function getAllObserverMultKlipp(){
    var array_observer = [];
    $("#tb-list-profile-mult-klpp tbody tr").each(function(){
        var data = {
            id_user : $(this).data().id_user,
            id_permition : $(this).data().id_permition
        }
        if(data.id_user != undefined){
            array_observer.push($(this).data());
        }
    });
    return array_observer;
}
function hasPerfilResponsableMultKlp(id_user, id_permition){
    var flag_user = false;
    var flag_perm = false;
    $("#tb-list-profile-mult-klpp tbody tr").each(function(){
        // console.log($(this).data().id_user + "==" + id_user);
        if($(this).data().id_user == id_user){
            flag_user = true;
            // break;
        }
        
        if($(this).data().id_permition == id_permition && id_permition == 3){
            flag_perm = true;
            // break;
        }
    });
    return flag_user || flag_perm;
}
function drawObsrvrOnTableMultKlp(array_observer){
    var table =  $("#tb-list-multiple-klipps").find("tr.selected");
    table.find(".vobo-mas-mult-klp").html("");
    table.find(".responsable-mas-mult-klp").html("");
    table.find(".obsrver-mas-mult-klp").html("");
    $("#tb-list-profile-mult-klpp tbody tr").each(function(){
        var data = $(this).data();
        switch (data.id_permition) {
            case 1:
                // table.find("").html(data.email);
                break;
            case 2:
                table.find(".vobo-mas-mult-klp").append(data.email);
                break;
            case 3:
                table.find(".responsable-mas-mult-klp").append(data.email);                
                break;
            case 4:
                table.find(".obsrver-mas-mult-klp").append(data.email);            
                break;
            default:
                console.log("No existe :(");
                break;
        }
    });    
}
function drawProfileForFormEditMultKLipp(tr){
    var iteration = 0;
    var data = $(tr).data();
    var profile_permition = $("#tb-list-multiple-klipps").data().profile_observer;
    var profile = ["vobo", "observer", "responsable"];
    if(data.allpermition === undefined){
        for (let index_pro = 0; index_pro < profile.length; index_pro++) {
            var type_profile =  profile[index_pro];
            for (let index = 0; index < data[type_profile].length; index++) {
                var vobo = data[type_profile][index]; 
                var name_user = $("#user-id-mult-klipp [value='"+vobo.id_user+"']").text();
                name_user = name_user.split(" - "); 
                name_user = name_user[0];
                var permition = searchInArray(profile_permition, vobo.id_permition, "id_permition").name;
                var tr = '<tr data-email = "'+vobo.email+'" data-user="0" data-permition = "'+permition+'" data-id_user = '+vobo.id_user+
                ' data-id_permition= '+vobo.id_permition+'><td>'+name_user+'</td><td>'+permition+'</td><td class="text-center"><button id="dlt-pr-m-klp'+iteration+'" class="btn btn-danger btn-xs delete-usr-mult-klp"><i class="fa fa-trash"></i></button></td></tr>'; 
                $("#body-list-user-profile-mult-klipp").append(tr);
        
                $("#dlt-pr-m-klp"+iteration).on("click", function(){
                    deleteObsrMultKlipp(this);
                });
                iteration++;
            }
        }
    }else{
        for (let index = 0; index < data.allpermition.length; index++) {
            var vobo = data.allpermition[index];
            var name_user = $("#user-id-mult-klipp [value='"+vobo.id_user+"']").text();
            name_user = name_user.split(" - "); 
            name_user = name_user[0];

            var permition = searchInArray(profile_permition, vobo.id_permition, "id_permition").name;
            var tr = '<tr data-email = "'+vobo.email+'" data-user="0" data-permition = "'+permition+'" data-id_user = '+vobo.id_user+
            ' data-id_permition= '+vobo.id_permition+'><td>'+name_user+'</td><td>'+permition+'</td><td class="text-center"><button id="dlt-pr-m-klp'+iteration+'" class="btn btn-danger btn-xs delete-usr-mult-klp"><i class="fa fa-trash"></i></button></td></tr>'; 
            $("#body-list-user-profile-mult-klipp").append(tr);
    
            $("#dlt-pr-m-klp"+iteration).on("click", function(){
                deleteObsrMultKlipp(this);
            });
            iteration++;
        }
    }
}
function searchInArray(array, search, property){
    var result = null;
    for (let index = 0; index < array.length; index++) {
        let data = array[index];
        if(data[property] == search){
            result = data;
            break;
        }
    }
    return result;
}
function buildStructureKlippToSave(){
    var array_response = {};
    var array = [];
    var hasError = false;
    var row = $("#tb-list-multiple-klipps tbody tr");

    row.each(function(){
        var data = $(this).data();
        var info = {
            "title"             : data.title,
            "description"       : data.description,
            "start_date"        : data.start_date,
            "finish_date"       : data.finish_date,
            "id_proyect"        : data.id_proyect,
            "id_milestone"      : data.id_milestone,
            "deliverable"       : data.deliverable,
            "id_area"           : data.id_area,
            "id_departament"    : data.id_department,
            "is_ticket"         : data.is_ticket
        }

        if(data.has_error == "1"){
            hasError = true;
        }
        var allpermitions = data.allpermition;
        if(allpermitions === undefined) {
            allpermitions = buildProfileSnMultKlipp(this);
        }
        array.push({info: info, allpermitions: allpermitions});
    });
    array_response.klipps = array; // asignamos los klipps en el array_response
    array_response.hasError = hasError;
    // console.log(array_response);
    return array_response;
    
}

function buildProfileSnMultKlipp(tr){
    var array = [];
    var data = $(tr).data();
    var profile_permition = $("#tb-list-multiple-klipps").data().profile_observer;
    var profile = ["vobo", "observer", "responsable"];
    console.log("=============");
    for (var i_pro = 0; i_pro < profile.length; i_pro++) {
        var type_profile =  profile[i_pro];
        var tam = data[type_profile].length;
        for (var ind_user = 0; ind_user < tam; ind_user++) {
            var prof_permi = data[type_profile][ind_user]; 
            var permition = searchInArray(profile_permition, prof_permi.id_permition, "id_permition").name;
            var enddata = {
                email: prof_permi.email,
                id_permition: prof_permi.id_permition,
                id_user: prof_permi.id_user,
                permition: permition,
                user: 0
            }
            array.push(enddata);
        }
    }
    return array;
}
function addOptionForDepartamentMultKlipp(id_area, id_depto_s) {
    count = Object.keys(JSONGral.areas).length;
    $("#input-depto-up-mult-klp").append($('<option>', {
        value: "Seleccionar",
        text: deptos[j].nombre_depto
    }));
    $("#input-depto-up-mult-klp  option").remove();
    for (let i = 0; i < count; i++) {

        if (JSONGral.areas[i].id_area == id_area) {
            var deptos = JSONGral.areas[i].deptos;
            // console.log(deptos);
            count_milestone = Object.keys(deptos).length;

            for (let j = 0; j < count_milestone; j++) {
                $("#input-depto-up-mult-klp").append($('<option>', {
                    value: deptos[j].id_depto,
                    text: deptos[j].nombre_depto
                }));
                if(deptos[j].id_depto == id_depto_s){
                    $("#input-depto-up-mult-klp option[value='"+id_depto_s+"']").prop("selected", true);
                    /* if(!$("#input-depto-up-mult-klp").hasClass("has-been-modified")){
                        $("#input-depto-up-mult-klp").addClass("has-been-modified");
                    } */
                }
            }
            break;
        }
    }
}
/* End function for charge masive */
var klippIsOpen = false;

$(document).ready(function () {
    $("#open-form-create-klipp").on("click", function () {
        let preselect = $(this).data().preselect;
        loadFormKLIPP(klippIsOpen, preselect);
        klippIsOpen = !klippIsOpen;
        closeContentKlipp("allViews");
    });

    /* Carga form masiva */
    $("form#upload-file-multiple-klipp").on("submit", function(event){
        event.preventDefault();
        var input_file = $(this).find("input");
        input_file.removeAttr("style");

        if(input_file.val() != 0){
            var form_data = new FormData(this);
            form_data.append("is_ticket", flag_is_ticket_for_mult_klipp);
            uploadFileMultipleKlipps(form_data);
            $("#upload-file-multiple-klipp input[type='file']").val(null);
        }else{
            input_file.css({border: "1px solid red"});
        }
    });
    $("button#close-form-edit-mult-klipp, button#close-modal-details-mult-klipp").on("click", function(){
        /* close modal form edit mult klipps*/
        closeFormEditMultKlipp();
    });

    $("button#save-form-edit-mult-klipp").on("click", function(){
        saveDataLogicForKlipp();
        $(".ctn-modal-up-mult").fadeOut(function(){
            $(this).removeAttr("style");
        });
    });
    /* End carga form masiva */
});