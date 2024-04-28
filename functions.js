
// *************************************************************
//         *************** FUNCTIONS ******************
// *************************************************************

// OrderEntryBean-getProdGradSpecs
function getOEJSON() {
	// Logged In or Guest Mode
    if ( (isFlagIdSet("OE",1)) || (isFlagIdSet("GE",1))) {
    //loaderWidget(true);
    $.ajax({url: contextPath + "/OrderEntryJSON",
        success: function (result, status, xhr) {
          var data = result;
          $("#selectprodtype").children().remove();
          var str = "js1Data Data:<br>";	
          if (isFlagIdSet("PRDSEL",3) ||
              isFlagIdSet("PRDSEL",6)	) {
            cls = data.js1Data; 
            grd = data.js2Data; 
            tmp = data.js3Data;
            shp = data.js4Data;
            thk = data.js5Data;
            siz = data.js6Data;
          } else if (isFlagIdSet("PRDSEL",4)) {
            cls = data.js1Data; 
            grd = data.js2Data; 
            shp = data.js3Data;
            thk = data.js4Data;
            siz = data.js5Data;            	
          } else if (isFlagIdSet("PRDSEL",5)) {
            cls = data.js1Data; 
            shp = data.js2Data;
            grd = data.js3Data; 
            tmp = data.js4Data;
            thk = data.js5Data;
            siz = data.js6Data;
          }
          
          GS  = data.GradeSpecs;
          PN  = data.PartNbrs;
          UOM = data.QtyUom;
          DLY = data.DailyItems;
          loadPn();
          loadDly();
          loadCls();
          //loaderWidget(false);
        },
          error: function (xhr, status, error) {
          alert(error);
        }
    });	// Logged In or Guest Mode
  } else if (isFlagIdSet("DLYOFR",1)) {
    
        //loaderWidget(true);
        $.ajax({url: contextPath + "/OrderEntryJSON",
            success: function (result, status, xhr) {
          var data = result;
          $("#selectprodtype").children().remove();
          var str = "js1Data Data:<br>";	
          cls = ""; 
          grd = ""; 
          tmp = ""; 
          shp = "";
          thk = "";
          siz = "";
          GS  = "";
          PN  = "";
          UOM = "";
          DLY = data.DailyItems;
          loadDly();
          //loaderWidget(false);
        },
          error: function (xhr, status, error) {
          alert(error);
        }
    });
  }
    
}

function loadDly() {
	for (s in DLY) {                                                                   
	    $('select#daily').append('<option value="' + s + "_" + DLY[s][1][0][1] +'">' + s + '</option>');
	}  
    $('#daily').selectmenu();
    $('#daily').selectmenu('refresh', true);
}

function loadPn() {
	for (s in PN) {                                                                   
	    $('select#part').append('<option value="' + s + "_" + PN[s][1][0][1] + '">' + s + '</option>');
	}  
    $('#part').selectmenu();
    $('#part').selectmenu('refresh', true);
}

function loadCls() {                                                                    
	for (s in cls) {                                                                   
	    $('select#cls').append('<option value="' + s + '">' + cls[s][0] + '</option>');
	    
        $('div>#product-classes').append(`<div class="d-flex justify-content-center align-items-center">
                                                <a href="#" onClick="updateDropdown('cls','`+s+`'); return false;">
                                                    <div class="card slick-card bg-dark text-white">
                                                        <img src="images/class/`+cls[s][0].toLowerCase()+`.jpg" onerror="this.src='images/class/sample.jpg';this.onerror='';" class="card-img" height="158" width="198">
                                                        <div class="card-img-overlay slick-img-overlay d-flex justify-content-center align-items-center">
                                                            <div class="fs-5 prd-class-text text-center open-sans-font">`+cls[s][0]+`</div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>`);
	}

    $('#cls-loader').remove('');

    $('div>#product-classes').slick({
		speed: 300,
		slidesToShow: 6,
		slidesToScroll: 6,
		responsive: [
			{
				breakpoint: 1700,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 5
				}
			},
			{
				breakpoint: 1450,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4
				}
			},
			{
			  breakpoint: 1080,
			  settings: {
			    slidesToShow: 3,
			    slidesToScroll: 3
			  }
			},
			{
			  breakpoint: 850,
			  settings: {
			    slidesToShow: 2,
			    slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 600,
			  settings: {
			    slidesToShow: 1,
			    slidesToScroll: 1
			  }
			}
		]
	});

    $('#cls').selectmenu();
    $('#cls').selectmenu('refresh', true);
}

function loadGrade(selected) {
	var options = grd[selected][1];
    for (o in options) {
        $('select#grade').append('<option value="'+ options[o][0] +'">' + options[o][1]+'</option>');

        $('.row-filtering > #grade-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('grade','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`)
    }

    $('#grade').selectmenu();
    $('#grade').selectmenu("refresh", true);
    $('.row-filtering > #grade-options').fadeIn();
}

function loadGradeSpec(selected) {
    var wSelect = selected.split('_');
    if (GS !=null && typeof GS === 'object' && GS.hasOwnProperty(wSelect[1])) {
	  var options = GS[wSelect[1]][1];
      var gsFound = false;
	  for (o in options) {
		$('select#sspec').append('<option value="' + options[o][0] + '">' + options[o][1] + '</option>');

        $('.row-filtering > #sspec-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('sspec','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`)
		if (gsFound == false) {
		    enableSelect('sspec');
		    enableLabel('spec', true);
            $('.row-filtering > #sspec-options').fadeIn();
		    gsFound = true;
		}
	  }
    }
}

function loadTemper(selected) {
	if (selected == "any") {
	  for (var property in grd) {
		if (grd.hasOwnProperty(property)) {
		  if (property.includes($('select#grade option:selected').val())) {
			var options = grd[property][1];
		    for (o in options) {
		      $('select#temper').append('<option value="'+ options[o][0] +'">'+ property.split('_')[2] + " " + options[o][1] + '</option>');
		    }
		  }
		}
	  }
	} else {
	  var options = tmp[selected][1];
	  for (o in options) {
        $('select#temper').append('<option value="'+ options[o][0] +'">' + options[o][1]+'</option>');

        $('.row-filtering > #temper-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('temper','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`)
	  }
	}

    $('#temper').selectmenu();
    $('#temper').selectmenu("refresh", true); 
    $('.row-filtering > #temper-options').fadeIn();   
}

function loadShape(selected) {

    var options = shp[selected][1];

	if (selected.split("_")[2] == "ANY") {
	  var wSelGrade  = $('select#grade option:selected').val();
      // Load everything From Grade
	  for (var property in shp) {
	    if (shp.hasOwnProperty(property)) {
	      var see = wSelGrade;
		  if (property.includes(wSelGrade)) {
			var options = shp[property][1];
		    for (o in options) {

			  $('select#shape').append('<option value="'+ options[o][0] +'">'+ options[o][1] +  '</option>');
              
              // $('.row-filtering > #shape-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('shape','`+options[o][0]+`',this); return false;">`+property.split('_')[2] + " " + options[o][1]+`</button>`);
              $('.row-filtering > #shape-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('shape','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`);
		    
		    }
		  }
	    }
	  }
	// Load only Selected Shape
	} else {
      for (o in options) {
        // var desc = options[o][0];
        // alert(desc);
         $('select#shape').append('<option value="'+ options[o][0] +'">' + options[o][1] +'</option>');
         
         $('.row-filtering > #shape-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('shape','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`);
      }
	}

    $('#shape').selectmenu();
    $('#shape').selectmenu('refresh', true);
    $('.row-filtering > #shape-options').fadeIn();
}

function loadThick(selected) {  
	if (isFlagIdSet("PRDSEL",6)) {
	  $('select#thick').append('<option value=any>* Any Selected</option>');
	}
	if (selected == "any") {
		  var wSelTemper = $('select#temper option:selected').val();
	      var wSelGrade  = $('select#grade  option:selected').val();
		  // Load everything From Temper
		  if (wSelTemper != "any") {
		    for (var property in shp) {
		      if (shp.hasOwnProperty(property)) {
		    	var see = wSelTemper;
				if (property.includes(wSelTemper)) {
				  var options = thk[property][1];
			      for (o in options) {
				   // $('select#shape').append('<option value="'+ options[o][0] +'">'+ property.split('_')[2] + " " + options[o][1] + '</option>');

                   // $('.row-filtering > #shape-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('shape','`+options[o][0]+`',this); return false;">`+property.split('_')[2] + " " + options[o][1]+`</button>`);
				  }
			    }
			  }
		    }	
		  // Load everything From Grade
	  	  } else {
	        for (var property in shp) {
	          if (shp.hasOwnProperty(property)) {
	    	    var see = wSelGrade;
			    if (property.includes(wSelGrade)) {
			      var options = shp[property][1];
		          for (o in options) {
			       // $('select#shape').append('<option value="'+ options[o][0] +'">'+ property.split('_')[2] + " " + options[o][1] + '</option>');

                  //  $('.row-filtering > #shape-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('shape','`+options[o][0]+`',this); return false;">`+property.split('_')[2] + " " + options[o][1]+`</button>`);
			      }
		        }
		      }
	        }
	  	  }
	// Load only Selected Shape
	} else {
	  var options = thk[selected][1];                                                               
	  for (o in options) {                                                                         
	     $('select#thick').append('<option value="' + options[o][0] + '">' + options[o][1] + '</option>');

         $('.row-filtering > #thick-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('thick','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`);
	  }
	}
    $('#thick').selectmenu();
    $('#thick').selectmenu("refresh", true);  
    $('.row-filtering > #thick-options').fadeIn();  
}                                                                                                    

function loadSize(selected) {
	if (selected == "any") {
      for (var property in siz) {
		if (siz.hasOwnProperty(property)) {
		  if (property.includes($('select#shape option:selected').val())) {
		    var options = siz[property][1];
		    for (o in options) {
		      $('select#size').append('<option value="'+ options[o][0] +'">' + options[o][1]+'</option>');

              $('.row-filtering > #size-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('size','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`);
		    }
		  }
		}
      }
	} else {
        
      var options = siz[selected][1];
      for (o in options) {
        $('select#size').append('<option value="'+ options[o][0] +'">' + options[o][1]+'</option>');

        $('.row-filtering > #size-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('size','`+options[o][0]+`',this); return false;">`+options[o][1]+`</button>`);
      }
	}

    $('#size').selectmenu();
    $('#size').selectmenu("refresh", true);    
    $('.row-filtering > #size-options').fadeIn(); 
}

function loadUOM(uomS) {                                                                                                               
    for (var x = 0; x < uomS.length; x++) {                                                                                                                                                                                                                                                                                                                   
      $('select#uom').append('<option value="' + uomS[x][0] + '">' + uomS[x][0] + '</option>');

      $('.row-filtering > #uom-options .btn-group').append(`<button type="button" class="btn bs-btn fbtn fw-bold btn-outline-light" onClick="updateDropdown('uom','`+uomS[x][0]+`',this); return false;">`+uomS[x][0]+`</button>`);
    }  

    $('#uom').selectmenu();
    $('#uom').selectmenu('refresh', true);
    $('.row-filtering > #uom-options').fadeIn(); 
}

function toggleActiveClass(btn) {
    $(btn).addClass('active').siblings().removeClass('active')
}

function updateDropdown(sel,val,btn=false) {
    $("#" + sel).val(val).change();
    if (btn) toggleActiveClass(btn);
}


function productsLoader(show,msg) {
	if (!msg) {
		msg = 'Loading Products...'
	}
	if (show === true) {
		var html = '<div id="prd-loader" style="height:160px" class="d-flex flex-column justify-content-center align-items-center"><div><img src="images/icon_red.png" class="logo-spinner" /></div><span class="mt-3 open-sans-font fw-bold fs-6 d-flex align-items-center justify-content-center logo-spinner-txt no-txt-shadow">' + msg + '</span></div>';
		$('#product-listings').append(html);
	} else {
		$('#prd-loader').remove();
	}
}

function popupLoader(container, show, msg) {
	if (!msg) {
		msg = 'Loading...'
	}
	if (show === true) {
		var html = '<div id="popup-loader" style="height:160px" class="d-flex flex-column justify-content-center align-items-center"><div><img src="images/icon_red.png" class="logo-spinner" /></div><span class="mt-3 open-sans-font fw-bold fs-6 d-flex align-items-center justify-content-center logo-spinner-txt logo-spinner-red no-txt-shadow">' + msg + '</span></div>';
		$("#"+container).empty();
		$("#"+container).append(html);
	} else {
		$("#"+container+" > #popup-loader").remove();
	}
}

function productSelector(partInfo, dailyOfr, itmQty, loadMsg) {
    if (itmQty) {
        qty = itmQty;
    } else {
        qty = $('#selectorQTY').val();
    }
    if (qty === '' || qty === null || qty === 0) {
        qty = 1;
    }

    if (loadMsg) {
        locateProduct(class1, grade, temper, shape, thick, size1, size2, size3, size4, uom, qty, partInfo, dailyOfr, loadMsg);
    } else {
        locateProduct(class1, grade, temper, shape, thick, size1, size2, size3, size4, uom, qty, partInfo, dailyOfr);
    }	
}

function locateProduct(class1, grade, temper, shape, sort, size1, size2, size3, size4, uom, qty, partInfo, dailyOfr, msg) {
    if (msg) {
       //loaderWidget(true, msg);
    } else {
        //loaderWidget(true);
    }
    $('#product-listings').empty();
    productsLoader(true,msg);
    var size2 = "";
    var size3 = "";
    var size4 = "";

    $.ajax({url: contextPath + "/OrderEntryJSON",
        type: "POST",
        data: {"action": "itemsearch",
            "lib": "MNFSALES",
            "dist": "01",
            "cls":    class1,
        	"grade":  grade,
        	"temper": "ANY",
            "shape":  shape,
            "thick":  sort,
            "sel1":   size1
            //"sel2":   size2,
            //"sel3":   size3,
            //"sel4":   size4,
            //"partInfo": partInfo,
            //"dailyOfr": dailyOfr},
             }, 
        success: function (result, status, xhr) {
            if (Array.isArray(result)) {
                if (result.length > 0) {
                  if (dailyOfr != "") {
    			    openPopup('invTagView',result, '', '', '02139', '01', '', dailyOfr);
    			    productsLoader(false);
                  } else {
                    itemLookup(result, uom, qty, dailyOfr, false);
                  }
                } else { 
                    productsLoader(false);
                    displayError("SORRY, NO ITEMS WERE FOUND. <br>Please use the Product Selector to search for another item. <br>In case of a system error, please <a href=\"\" onclick=\"reloadPage()\">RELOAD</a> the page and try your search again.");
                    //loaderWidget(false);
                }
            } else {
                productsLoader(false);
                displayError(result.Error);
                //loaderWidget(false);
            }
        },
        error: function (xhr, status, error) {
            alert("ERROR!!");
            productsLoader(false);
            displayError(error);
            //loaderWidget(false);
        }
    });
}

function clearBtnFilters(name,hide=false) {
    $('.row-filtering > #' + name + '-options .btn-group').html('');
    if (hide != false) $('.row-filtering > #' + name + '-options').hide();
}

function resetSelect(id, empty) {
    // Empty current items in select list and reset default value
    if (empty !== false) {
        $('select#' + id).empty();
        if (id === "size") {
            $('select#' + id).append('<option value="any" selected>* Any Selected</option>');
        }else if (id !== "uom") {
            $('select#' + id).append('<option value="none" selected>* None Selected</option>');
        }
        $('#' + id).selectmenu();
        $('#' + id).selectmenu('refresh', true);
    }

    // Add disabled state of select list
    $('select#' + id).addClass('mobile-selectmenu-disabled');
    $('div#' + id + '-button').addClass('ui-state-disabled');
    $('a#' + id + '-button').addClass('ui-state-disabled');
    if (id === "uom") {
        uomEnabled = false;
    }
}

function enableSelect(id) {
    // Remove disabled state of select list
    $('select#' + id).removeProp('disabled').removeClass('mobile-selectmenu-disabled');
    $('div#' + id + '-button').removeClass('ui-state-disabled');
    $('a#' + id + '-button').removeClass('ui-state-disabled');
    if (id === "uom") {
        uomEnabled = true;
    }
}

function enableLabel(id, enable) {
    if (enable === true) {
        $('h4#lbl-' + id).addClass('active');
    } else {
        $('h4#lbl-' + id).removeClass('active');
    }
}

function loaderWidget(status, message) {
    if (message) {
        var loadMsg = message;
    } else {
        var loadMsg = "Loading Data...";
    }
    if (status === true) {
        var $this = $(this),
                    theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                    msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
                    textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
                    textonly = !!$this.jqmData("textonly");
                    html = $this.jqmData("html") || "";

                    $.mobile.loading("show", {
                        text: loadMsg,
                        textVisible: true,
                        theme: theme,
                        textonly: false,
                        html: html
                    });
    } else {
        $.mobile.loading("hide");
    }
}

/*
 * FUNCTION - Item Lookup
 * recs = Object of items results
 * uom = Unit of Measure
 * qty = Quantity
 */

function itemLookup(items, uom, qty, dailyofr, updateSize) {
    var loadHeaderOnce = 'YES';
        
    if (updateSize === true) {
		$('#product-listings').empty();
    	productsLoader(true,'Updating Size...');
	}

    for (var x = 0; x < items.length; x++) {
        //console.log(items[x]);
        var itemstr  = items[x]["ITEMNO"];
    	var partnbr  = items[x]["CUSTITEM"];  
        var length1 = items[x]["LENGTH"];
        var width1 = items[x]["WIDTH"];
        $.ajax({url: contextPath + "/OrderEntryJSON",
            type: "POST",
            data: {"action" : "itemlookup",
                   "itemno" : itemstr,
                   "qty"    : qty,
                   "uom"    : uom,
                   "partnbr": partnbr,
                   "dailyofr": dailyofr,
                   "length1": length1,
                   "width1": width1},
            success: function (result, status, xhr) {
                //console.log(result);
                var price = parseFloat(result.PRICE);
                    price = formatCurrency(price);
                var extPrice = parseFloat(result.EXTPRC);
                    extPrice = formatCurrency(extPrice);
                var size = result.DSPSIZE;
                var pUOM = result.IOPUOM;
              
                if (extPrice === 'NaN') {
                    extPrice = ' ----';
                }

                if (price === 'NaN') {
                    price = ' ----';
                }

                var specDetail = getSpecDetail('a');

                // var inventoryInfo = '<button id=' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini">Show Inventory</button>';
                var invInfo = `<button type="button" class="btn btn-red-sm bs-btn btn-sm fw-bold" data-bs-toggle="modal" data-bs-target="#invView" title="Show Inventory" onClick="popupLoader('invContainer',true,'Loading Inventory...');">Show Inventory</button>`;
                
                if (!loggedIn) {
                    //price = "----";
                    //extPrice = "----";
                    var btnVal = "Add to Cart";
                    var btnHREF = "#login";
                    var btnClick = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    //var priceInfo = '<td><a href="' + btnHREF + '" id="btnItem" onclick="' + btnClick + '" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop">' + btnVal + '</a><td/>'
                    /*var priceInfo = `<div class="card-footer d-flex justify-content-end align-items-center py-10">
                                        <a class="btn bs-btn btn-sm btn-dark fw-bold" style="color:white;text-shadow:none;" href="` + btnHREF + `" id="btnItem" onclick="` + btnClick + `" item="` + result.ITEMNO + `" data-rel="popup" data-position-to="window" data-bs-toggle="modal" data-bs-target="#login" role="button" data-transition="pop">` + btnVal + `</a>
                                    </div>`;*/
                    priceInfo = `<div class="card-footer d-flex justify-content-between align-items-center py-10">
                                    <div class="input-group input-group-sm reset w-20">
                                        <span class="input-group-text gray-fade-bg card-qty" id="basic-addon1" style="width:2.5rem;">Qty</span>
                                        <div class="w-40">
                                            <input type="text" class="form-control form-control-sm text-center card-qty" placeholder="#" aria-describedby="basic-addon1" name="qty" id="qty" item="` + result.ITEMNO + `" value="` + result.QTY + `" grd="` + grd + `" shp="` + shp + `" thk="` + thk + `" wid="` + result.WIDTH + `" len="` + result.LENGTH + `"   uom="` + uom + `" partnbr="` + partnbr + `" dailyofr="` + dailyofr + `">
                                        </div>
                                    </div>
                                    <div class="fs-6">$` + price + `<span class="text-muted fw-light small">/` + pUOM + `</span></div>
                                    <div></div>
                                    <div class="fs-5 fw-bold">$` + extPrice + `<span class="text-muted fw-light fs-6">/` + uom + `</span></div>
                                    <button type="button" class="btn bs-btn btn-sm btn-red-sm fw-bold" id="btnItem" onclick="` + btnClick + `" item="` + result.ITEMNO + `" data-rel="popup" data-position-to="window" data-transition="pop">` + btnVal + `</button>
                                </div>`;
                } else if (dailyofr == "" && (isFlagIdSet("OE",3) || (isFlagIdSet("OE",4))) && isFlagIdSet("OE",9)) {
                    btnVal    = "Add to Cart";
                    btnHREF   = ""; 
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    /*priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input autocomplete ="new-password" type="text" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"  /></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + uom      + '</div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data">$' + price    + '</div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + pUOM     + '</div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data">$' + extPrice + '</div></td>\
                                 <td id="btnAction" style="text-align:right;"><a href="' + btnHREF + '" id="btnItem" onclick="' + btnClick + '" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop">' + btnVal + '</a><a href="' + btnHREF + '" id="btnUpdate" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop" style="display:none;">Update</a></td>';
                    */
                   priceInfo = `<div class="card-footer d-flex justify-content-between align-items-center py-10">
                                    <div class="input-group input-group-sm reset w-20">
                                        <span class="input-group-text gray-fade-bg card-qty" id="basic-addon1" style="width:2.5rem;">Qty</span>
                                        <div class="w-40">
                                            <input type="text" class="form-control form-control-sm text-center card-qty" placeholder="#" aria-describedby="basic-addon1" name="qty" id="qty" item="` + result.ITEMNO + `" value="` + result.QTY + `" grd="` + grd + `" shp="` + shp + `" thk="` + thk + `" wid="` + result.WIDTH + `" len="` + result.LENGTH + `"   uom="` + uom + `" partnbr="` + partnbr + `" dailyofr="` + dailyofr + `">
                                        </div>
                                    </div>
                                    <div class="fs-6">$` + price + `<span class="text-muted fw-light">/` + uom + `</span></div>
                                    <div></div>
                                    <div class="fs-5 fw-bold">$` + extPrice + `</div>
                                    <button type="button" class="btn bs-btn btn-sm btn-red-sm fw-bold" id="btnItem" onclick="` + btnClick + `" item="` + result.ITEMNO + `" data-rel="popup" data-position-to="window" data-transition="pop">` + btnVal + `</button>
                                </div>`;
                } else if (dailyofr == "" && (isFlagIdSet("OE",3) || (isFlagIdSet("OE",4))) && !isFlagIdSet("OE",9)) {
                	btnVal    = "Add";
                    btnHREF   = "";
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input  type="number" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"/></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data"></div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data"></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data"></div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data"></div></td>\
                                 <td id="btnAction" style="text-align:right;"><a href="' + btnHREF + '" id="btnItem" onclick="' + btnClick + '" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop">' + btnVal + '</a><a href="' + btnHREF + '" id="btnUpdate" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop" style="display:none;">Update</a></td>';
                } else if (dailyofr != "") {    
                    btnVal    = "";
                    btnHREF   = "";
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input  type="number" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"/></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">Tag Level</div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data">Tag Level</div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data">Tag Level</div></td>';
                } else if (dailyofr != "" || isFlagIdSet("OE",9)) {    
                    btnVal    = "";
                    btnHREF   = "";
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input  type="number" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"/></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + uom      + '</div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data">$' + price    + '</div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + pUOM     + '</div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data">$' + extPrice + '</div></td>';
                }
                // Check View Tags Flag to determine if LINK for display tags available.
                var invInfo = "";
                var sizeChange = "";
                var inputFieldLen = "";
                var inputFieldWid = "";
                if (isFlagIdSet("OE",5)) { 	 
                  //invInfo = '<button id=' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini">Show Inventory</button>';
                  invInfo = `<button type="button" id=` + result.ITEMNO + ` class="btn bs-btn btn-sm btn-red-sm fw-bold" data-bs-toggle="modal" data-bs-target="#invView" onClick="popupLoader('invContainer',true,'Loading Inventory...');">Show Inventory</button>`;
                  //
                }
                var newSizeDisplay = 'Default';
                if (dailyofr === "" && partnbr === "") {
                    
                    //sizeChange = '<div style="display:flex;"><div style="flex:1; margin-top:15px;"><button id=ssButt' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" onClick="specifySizeFunction(' + result.ITEMNO + ',' + result.LENGTH + ',' + result.WIDTH + ');">Specify Size</button></div>';
                    //sizeChange = sizeChange+'<div id=SpecifySizeParentDiv'+result.ITEMNO+ ' style="display:none;"><div id= ssWidDiv' + result.ITEMNO + ' style="display: none; flex:1; margin-left:10px;">Specify Width: <input type="number" value="'+ parseFloat(result.WIDTH) +'" id="ssWid' + result.ITEMNO + '"/></div>';
                    //sizeChange = sizeChange+'<div id= ssWidDivSelect' + result.ITEMNO + ' style="display: none; flex:1; width:200px; margin-left:10px; margin-top:15px;"><select id="ssWidUOM' + result.ITEMNO + '"> <option value="inch">INCHES</option><option value="feet">FEET</option></select></div>';
                    //sizeChange = sizeChange+'<div id= ssLenDiv' + result.ITEMNO + ' style="display: none; flex:1;"> Specify Length: <input type="number" value="'+ parseFloat(result.LENGTH) +'" id="ssLen' + result.ITEMNO + '"/></div>';
                    //sizeChange = sizeChange+'<div id= ssLenDivSelect' + result.ITEMNO + ' style="display: none; flex:1; width:200px; margin-left:10px;  margin-top:15px;"> <select id="ssLenUOM' + result.ITEMNO + '"> <option value="inch">INCHES</option><option value="feet">FEET</option></select></div>';
                    //sizeChange = sizeChange+'<div id= ssOKButt' + result.ITEMNO + ' style="flex:1;  margin-left:10px;  margin-top:15px;"><button id=ssButt' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" onClick="updateSizeCall(' + result.ITEMNO + ',' + result.QTY + ','+"'" + result.UNITS + "'" +');">Update</button></div></div></div>';
                    
                    sizeChange = `<div class="d-flex mt-3 align-items-center justify-content-between">
                                    <button type="button" id=ssButt` + result.ITEMNO + ` class="btn bs-btn btn-sm btn-red-sm fw-bold" onClick="specifySizeFunction(` + result.ITEMNO + `,` + result.LENGTH + `,` + result.WIDTH + `);">Specify Size</button>`;
                    sizeChange = sizeChange + `<div class="input-group reset flex-grow-1 w-50 justify-content-end">`;
                    sizeChange = sizeChange + `<div id=SpecifySizeParentDiv` + result.ITEMNO + ` style="display:none;"><div id= ssWidDiv` + result.ITEMNO + ` style="display: none;">`;
                    sizeChange = sizeChange + `<div id= ssWidDivSelect` + result.ITEMNO + ` style="display: none;" class="me-3 justify-content-end">
                                                    <input type="number" class="form-control form-control-sm w-38 card-qty" value="`+ parseFloat(result.WIDTH) +`" id="ssWid` + result.ITEMNO + `"/>
                                                    <input type="hidden" id="ssWidUOM` + result.ITEMNO + `" value="inch"/>
                                                    <button class="btn bs-btn btn-sm btn-outline-secondary dropdown-toggle uom-dropdown-btn card-qty bc-d9 hide" type="button" id="ssWidUOMBtn` + result.ITEMNO + `" data-bs-toggle="dropdown" aria-expanded="false">INCHES</button>
                                                    <ul class="dropdown-menu dropdown-menu-end">
                                                        <li><a class="dropdown-item" href="#">INCHES</a></li>
                                                        <li><a class="dropdown-item" href="#">FEET</a></li>
                                                    </ul>
                                                </div>
                                                <span class="d-flex align-items-center justify-content-center pe-3">X</span>
                                            </div>`;
                    sizeChange = sizeChange + '<div id= ssLenDiv' + result.ITEMNO + ' style="display: none;" class="me-3">';
                    sizeChange = sizeChange + `<div id= ssLenDivSelect` + result.ITEMNO + ` style="display: none;">
                                                    <input type="number" class="form-control form-control-sm w-25 card-qty" value="` + parseFloat(result.LENGTH) + `" id="ssLen` + result.ITEMNO + `"/>
                                                    <input type="hidden" id="ssLenUOM` + result.ITEMNO + `" value="inch"/>
                                                    <button class="btn bs-btn btn-sm btn-outline-secondary dropdown-toggle uom-dropdown-btn card-qty bc-d9" type="button" id="ssLenUOMBtn` + result.ITEMNO + `" data-bs-toggle="dropdown" aria-expanded="false">INCHES</button>
                                                    <ul class="dropdown-menu dropdown-menu-end" id="uom-dropdown">
                                                        <li><a class="dropdown-item uom-dropdown-item" href="#">INCHES</a></li>
                                                        <li><a class="dropdown-item uom-dropdown-item" href="#">FEET</a></li>
                                                    </ul>
                                                </div>
                                            </div>`;
                    sizeChange = sizeChange + `<button type="button" class="btn bs-btn btn-sm btn-red-sm fw-bold" id="ssButt` + result.ITEMNO + `" onClick="updateSizeCall(` + result.ITEMNO + `,` + result.QTY + `,'` + result.UNITS + `');">Update</button>
                                                </div>
                                                </div>
                                                </div>`;
                    /*
                    <div class="d-flex mt-3 align-items-center justify-content-between">
                      <button type="button" class="btn bs-btn btn-sm btn-dark fw-bold">Specify Size</button>
                      <div class="input-group reset justify-content-center w-50">
                        <input type="text" class="form-control form-control-sm">
                        <button class="btn bs-btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">INCHES</button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li><a class="dropdown-item" href="#">INCHES</a></li>
                          <li><a class="dropdown-item" href="#">FEET</a></li>
                        </ul>
                      </div>
                      <button type="button" class="btn bs-btn btn-sm btn-dark fw-bold">Update</button>
                    </div>
                    */
                    
                    var inchSymbol = '"'; var feetSymbol = "'";
                    if(parseFloat(result.WIDTH) !== 0 && parseFloat(result.LENGTH) !== 0)
                    newSizeDisplay = parseFloat(result.WIDTH)+ inchSymbol +'(' + parseFloat(result.WIDTH/12)+ feetSymbol + ') X '+ parseFloat(result.LENGTH)+ inchSymbol +'(' + parseFloat(result.LENGTH/12)+ feetSymbol + ')';
                    else if(parseFloat(result.WIDTH) !== 0)
                    newSizeDisplay = parseFloat(result.WIDTH)+ inchSymbol +'(' + parseFloat(result.WIDTH/12)+ feetSymbol + ')';
                    else if(parseFloat(result.LENGTH) !== 0)
                    newSizeDisplay = parseFloat(result.LENGTH)+ inchSymbol +'(' + parseFloat(result.LENGTH/12)+ feetSymbol + ')';
                }
				
                $('#product-listings').append(`<div class="col-12 col-lg-6 col-xxl-4 my-3 open-sans-font">
                                                    <div class="card text-center">
                                                        <div class="card-header d-flex align-items-center justify-content-between py-10">
                                                            <div>` + result.ITEMNO + `</div>` 
                                                            + invInfo + 
                                                        `</div>
                                                        <div class="card-body py-25">
                                                            <h4 class="card-text text-start">` + result.DESC + `</h4>
                                                            <h4 class="card-text text-start">` + specDetail + size + `</h4>
                                                            <h4 class="card-text text-start">Selected Size: ` + newSizeDisplay + `</h4>`
                                                            + sizeChange + 
                                                        `</div>` 
                                                        + priceInfo + 
                                                    `</div>
                                                </div>`);
                 
                //$('table#product-detail tbody').append('<tr id="' + result.ITEMNO + '">\
                //     <td><div class="ui-table-cell-label">Item</div><div class="ui-table-cell-data">' + result.ITEMNO + '<br/>' + partnbr + '<br/>' + invInfo +' ' + '</div></td>\
                // 	<td><div class="ui-table-cell-label">Description</div><div>' + result.DESC + '<br />' + specDetail + size + '<div style="display:flex;">Selected Size: '+ newSizeDisplay +' </div>' + sizeChange+'</div></td>\
                //    ' + priceInfo + '\
                //</tr>');          

                // View Inventory Summary (GETADINV)
                $(function() {
                	$("button").click ( function(event) {
                		if ($(this).attr('id') == result.ITEMNO.trim()) {
							$("#h5invView").text('');
                			var desc        = result.DESC;
                			var itemno      = result.ITEMNO;
                			var displayData = $.ajax({url: contextPath + "/OrderEntryJSON",
                			    type: "POST",                                              
                			    data: {"action": "invView",                              
                			    	   "itemno": result.ITEMNO,
                			    	   "partnbr": partnbr,
                			    	   "dailyofr": dailyofr},
                				dataType: "json",                                          
                				success: function (result) {                                            
                			    openPopup('invView',result, desc, '', itemno, result[0].DIST, partnbr, dailyofr);	                                                                                                                              
                				},                                                                                                                         
                			}); 
                		};
                	});
                })
                                
                //$('table#product-detail').trigger('create');

				productsLoader(false);
                //loaderWidget(false);
            },
            error: function (xhr, status, error) {
                loaderWidget(false);
                alert(error);
            },
        });
    };
}

function itemLookupOLD(items, uom, qty, dailyofr) {
    var loadHeaderOnce = 'YES';
    $('table#product-detail thead').empty();
    $('table#product-detail tbody').empty();

    for (var x = 0; x < items.length; x++) {
        //console.log(items[x]);
        var itemstr  = items[x]["ITEMNO"];
    	var partnbr  = items[x]["CUSTITEM"];  
        var length1 = items[x]["LENGTH"];
        var width1 = items[x]["WIDTH"];
        $.ajax({url: contextPath + "/OrderEntryJSON",
            type: "POST",
            data: {"action" : "itemlookup",
                   "itemno" : itemstr,
                   "qty"    : qty,
                   "uom"    : uom,
                   "partnbr": partnbr,
                   "dailyofr": dailyofr,
                   "length1": length1,
                   "width1": width1},
            success: function (result, status, xhr) {
                //console.log(result);
                var price = parseFloat(result.PRICE);
                    price = formatCurrency(price);
                var extPrice = parseFloat(result.EXTPRC);
                    extPrice = formatCurrency(extPrice);
                var size = result.DSPSIZE;
                var pUOM = result.IOPUOM;
              
                // Need data from OrderEntryJSON to check for FLAGS
                if (loadHeaderOnce == 'YES') {
                	loadHeaderOnce = 'NO ';
                	// Column headings will change on login.
                    if (isFlagIdSet("OE",9)) { 	
                        var hdrCol3 = 'Qty';
                        var cssCol3 = 'width:70px; text-align:center;';
                    } else if (!loggedIn) {
                        hdrCol3 = 'Price';
                        cssCol3 = 'width:100px;';
                    } else {
                    	hdrCol3 = '';
                    	cssCol3 = 'width:100px;';
                    }
                	$('table#product-detail thead').append('<tr>\
                			<th data-priority="2" data-colstart="1" style="width:70px;">Item</th>\
                			<th data-priority="1" data-colstart="2">Description</th>\
                			<th data-priority="3" data-colstart="3" style="' + cssCol3 + '">' + hdrCol3 + '</th>\
                        	</tr>');
                    if(isFlagIdSet("OE",9)) { 
                		$('table#product-detail thead tr').append('\
                				<th data-priority="3" data-colstart="4" style="width:50px;">UOM</th>\
                				<th data-priority="5" data-colstart="5" style="width:80px;">Price</th>\
                				<th data-priority="5" data-colstart="6" style="width:80px;">UOM</th>\
                				<th data-priority="5" data-colstart="7" style="width:80px;">Ext. Price</th>\
                        	    <th data-priority="4" data-colstart="8" style="width:72px;"></th>');
                	}
                }
              
                if (extPrice === 'NaN') {
                    extPrice = ' ----';
                }

                if (price === 'NaN') {
                    price = ' ----';
                }

                var specDetail = getSpecDetail('a');

                var inventoryInfo = '<button id=' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini">Show Inventory</button>';
                
                if (!loggedIn) {
                    price = "----";
                    extPrice = "----";
                    var btnVal = "Show Price";
                    var btnHREF = "#login";
                    var btnClick = "";
                    var priceInfo = '<td><a href="' + btnHREF + '" id="btnItem" onclick="' + btnClick + '" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop">' + btnVal + '</a><td/>'
                } else if (dailyofr == "" && (isFlagIdSet("OE",3) || (isFlagIdSet("OE",4))) && isFlagIdSet("OE",9)) {
                	btnVal    = "Add";
                    btnHREF   = ""; 
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input autocomplete ="new-password" type="text" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"  /></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + uom      + '</div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data">$' + price    + '</div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + pUOM     + '</div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data">$' + extPrice + '</div></td>\
                                 <td id="btnAction" style="text-align:right;"><a href="' + btnHREF + '" id="btnItem" onclick="' + btnClick + '" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop">' + btnVal + '</a><a href="' + btnHREF + '" id="btnUpdate" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop" style="display:none;">Update</a></td>';
                } else if (dailyofr == "" && (isFlagIdSet("OE",3) || (isFlagIdSet("OE",4))) && !isFlagIdSet("OE",9)) {
                	btnVal    = "Add";
                    btnHREF   = "";
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input  type="number" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"/></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data"></div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data"></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data"></div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data"></div></td>\
                                 <td id="btnAction" style="text-align:right;"><a href="' + btnHREF + '" id="btnItem" onclick="' + btnClick + '" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop">' + btnVal + '</a><a href="' + btnHREF + '" id="btnUpdate" item="' + result.ITEMNO + '" data-rel="popup" data-position-to="window" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" data-transition="pop" style="display:none;">Update</a></td>';
                } else if (dailyofr != "") {    
                    btnVal    = "";
                    btnHREF   = "";
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input  type="number" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"/></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">Tag Level</div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data">Tag Level</div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data">Tag Level</div></td>';
                } else if (dailyofr != "" || isFlagIdSet("OE",9)) {    
                    btnVal    = "";
                    btnHREF   = "";
                    btnClick  = "AddToCart('" + result.ITEMNO + "', '" + result.QTY + "', '" + result.UNITS + "','" + specDetail + "','" + partnbr + "','','',false,'" + result.WIDTH + "','" + result.LENGTH + "')";
                    priceInfo = '<td><div id="inQty" class="ui-table-cell-label">Qty</div><div class="ui-table-cell-data"><input  type="number" name="qty" id="qty" item="' + result.ITEMNO + '" value="' + result.QTY + '" grd="' + grd + '" shp="' + shp + '" thk="' + thk + '" wid="' + result.WIDTH + '" len="' + result.LENGTH + '"   uom="' + uom + '" partnbr="' + partnbr + '" dailyofr="'+dailyofr+'"/></div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + uom      + '</div></td>\
                                 <td><div class="ui-table-cell-label">Price     </div><div class="ui-table-cell-data">$' + price    + '</div></td>\
                                 <td><div class="ui-table-cell-label">UOM       </div><div class="ui-table-cell-data">'  + pUOM     + '</div></td>\
                                 <td><div class="ui-table-cell-label">Ext. Price</div><div class="ui-table-cell-data">$' + extPrice + '</div></td>';
                }
                // Check View Tags Flag to determine if LINK for display tags available.
                var invInfo = "";
                var sizeChange = "";
                var inputFieldLen = "";
                var inputFieldWid = "";
                if (isFlagIdSet("OE",5)) { 	 
                  invInfo = '<button id=' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini">Show Inventory</button>';
                  //
                }
                var newSizeDisplay = 'Default';
                if (dailyofr === "" && partnbr === "") {
                    
                    sizeChange = '<div style="display:flex;"><div style="flex:1; margin-top:15px;"><button id=ssButt' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" onClick="specifySizeFunction(' + result.ITEMNO + ',' + result.LENGTH + ',' + result.WIDTH + ');">Specify Size</button></div>';
                    sizeChange = sizeChange+'<div id=SpecifySizeParentDiv'+result.ITEMNO+ ' style="display:none;"><div id= ssWidDiv' + result.ITEMNO + ' style="display: none; flex:1; margin-left:10px;">Specify Width: <input type="number" value="'+ parseFloat(result.WIDTH) +'" id="ssWid' + result.ITEMNO + '"/></div>';
                    sizeChange = sizeChange+'<div id= ssWidDivSelect' + result.ITEMNO + ' style="display: none; flex:1; width:200px; margin-left:10px; margin-top:15px;"><select id="ssWidUOM' + result.ITEMNO + '"> <option value="inch">INCHES</option><option value="feet">FEET</option></select></div>';
                    sizeChange = sizeChange+'<div id= ssLenDiv' + result.ITEMNO + ' style="display: none; flex:1;"> Specify Length: <input type="number" value="'+ parseFloat(result.LENGTH) +'" id="ssLen' + result.ITEMNO + '"/></div>';
                    sizeChange = sizeChange+'<div id= ssLenDivSelect' + result.ITEMNO + ' style="display: none; flex:1; width:200px; margin-left:10px;  margin-top:15px;"> <select id="ssLenUOM' + result.ITEMNO + '"> <option value="inch">INCHES</option><option value="feet">FEET</option></select></div>';
                    sizeChange = sizeChange+'<div id= ssOKButt' + result.ITEMNO + ' style="flex:1;  margin-left:10px;  margin-top:15px;"><button id=ssButt' + result.ITEMNO + ' class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" onClick="updateSizeCall(' + result.ITEMNO + ',' + result.QTY + ','+"'" + result.UNITS + "'" +');">Update</button></div></div></div>';
                    var inchSymbol = '"'; var feetSymbol = "'";
                    if(parseFloat(result.WIDTH) !== 0 && parseFloat(result.LENGTH) !== 0)
                    newSizeDisplay = parseFloat(result.WIDTH)+ inchSymbol +'(' + parseFloat(result.WIDTH/12)+ feetSymbol + ') X '+ parseFloat(result.LENGTH)+ inchSymbol +'(' + parseFloat(result.LENGTH/12)+ feetSymbol + ')';
                    else if(parseFloat(result.WIDTH) !== 0)
                    newSizeDisplay = parseFloat(result.WIDTH)+ inchSymbol +'(' + parseFloat(result.WIDTH/12)+ feetSymbol + ')';
                    else if(parseFloat(result.LENGTH) !== 0)
                    newSizeDisplay = parseFloat(result.LENGTH)+ inchSymbol +'(' + parseFloat(result.LENGTH/12)+ feetSymbol + ')';
                }
                
                
                
                 
                $('table#product-detail tbody').append('<tr id="' + result.ITEMNO + '">\
                     <td><div class="ui-table-cell-label">Item</div><div class="ui-table-cell-data">' + result.ITEMNO + '<br/>' + partnbr + '<br/>' + invInfo +' ' + '</div></td>\
                 	<td><div class="ui-table-cell-label">Description</div><div>' + result.DESC + '<br />' + specDetail + size + '<div style="display:flex;">Selected Size: '+ newSizeDisplay +' </div>' + sizeChange+'</div></td>\
                    ' + priceInfo + '\
                </tr>');          

                // View Inventory Summary (GETADINV)
                $(function() {
                	$("button").click ( function(event) {
                		if ($(this).attr('id') == result.ITEMNO.trim()) {
                			var desc        = result.DESC;
                			var itemno      = result.ITEMNO;
                			var displayData = $.ajax({url: contextPath + "/OrderEntryJSON",
                			    type: "POST",                                              
                			    data: {"action": "invView",                              
                			    	   "itemno": result.ITEMNO,
                			    	   "partnbr": partnbr,
                			    	   "dailyofr": dailyofr},
                				dataType: "json",                                          
                				success: function (result) {                                            
                			    openPopup('invView',result, desc, '', itemno, result[0].DIST, partnbr, dailyofr);	                                                                                                                              
                				},                                                                                                                         
                			}); 
                		};
                	});
                })
                                
                $('table#product-detail').trigger('create');

                    loaderWidget(false);
            },
            error: function (xhr, status, error) {
                loaderWidget(false);
                alert(error);
            },
        });
    };
}

function jsonLogin() {
    var isGuest      = false;
    var userName     = $("#user").val();
    var Password     = $("#password").val();
    var guestCOMPANY = $("#guestCOMPANY").val();
    var guestNAME    = $("#guestNAME").val();
    var guestEMAIL   = $("#guestEMAIL").val();
    var guestPHONE   = $("#guestPHONE").val();
    
    // Sign-in as Guest
    if (userName === "" && Password === "") {

        if (guestCOMPANY === '') {
            alert("Company Name is required.");
            $("#guestCOMPANY").focus();
            return;
        }

        if (guestNAME === '') {
            alert("Your Name is required.");
            $("#guestNAME").focus();
            return;
        }

        if (guestPHONE === '') {
            alert("Phone Number is required.");
            $("#guestPHONE").focus();
            return;
        } else if (!validatePhone(guestPHONE)) {
            alert("Invalid Phone Number Entered");
            $("#guestPHONE").focus();
            return;
        }

        if (guestEMAIL === '') {
            alert("Email Address is required.");
            $("#guestEMAIL").focus();
            return;
        } else if (!validateEmail(guestEMAIL)) {
            alert("Invalid Email Address Entered");
            $("#guestEMAIL").focus();
            return;
        }

        if (guestCOMPANY !== "" && guestNAME !== "" && guestEMAIL !== "" && guestPHONE !== "") {
            isGuest = true;
        }
    }

    if (isGuest === true) {
        //submitGuestCartInfo2();
        //return;
        loaderWidget(true, 'Signing in ...');
        $.ajax({url: contextPath + "/AcctUserAjax",
                type: "POST",
                data: {"Action": "guest", "Userid": userName, "Passwd": Password, "guestCOMPANY": guestCOMPANY, "guestPHONE": guestPHONE, "guestEMAIL": guestEMAIL, "guestNAME": guestNAME},
                success: function (result, status, xhr) {
                if (result.AuthStatus === '1') { 
                    loaderWidget(false);
                    guestMode = true;
                    guestUserEmail = guestEMAIL;
                    loggedIn = true;
                    customerName = guestNAME;
                    //$('#login').popup("close");
                    enableButton(true, "btnCheckout");
                    $("a#btnAcctMenu").addClass('hide');
                    $("a#btnChatNow").addClass('hide');
                    $("a#btnNavMenu").addClass('hide');
                    $("div#btnShopCart").removeClass('hide');
                    loadSignInStatus();  
                    if (!isFlagIdSet("DLYOFR",1)) {                    
                      getOEJSON();
                      reloadPage();
                    }
                    //productSelector('',1,'');
                }
            }});    	
    } else {
        if (userName === '') {
            alert("Username  is required.");
            $("#user").focus();
            return;
        }
        if (Password === '') {
            alert("Password  is required.");
            $("#password").focus();
            return;
        }
        if (userName !== "" && Password !== "") {
            loaderWidget(true, 'Signing in ...');
            $.ajax({url: contextPath + "/AcctUserAjax",
                type: "POST",
                data: {"Action": "login", "Userid": userName, "Passwd": Password},
                success: function (result, status, xhr) {
                    if (result.AuthStatus === '1') {
                		loaderWidget(false);
                		//$('#login').popup("close");
                		// PASSWORD = PASSWORD has to change from use of password
                    	if (Password.toUpperCase()=="PASSWORD") {
                            window.location.assign(contextPath + "/ManageAccount.jsp");
                        // Normal user login
                    	} else {
                    		guestMode = false;
                    		guestUserEmail = result.UserEmail;
                    		loggedIn = true;
                    		customerName = result.UserName;                    		
                    		enableButton(true, "btnCheckout");
                    		$("a#btnAcctMenu").removeClass('hide');
                    		$("a#btnChatNow").removeClass('hide');
                    		$("a#btnNavMenu").removeClass('hide');
                    		$("div#btnShopCart").removeClass('hide');
                    		loadSignInStatus();      
                    		getOEJSON();
                    		reloadPage();
                    		//productSelector('',1,'');
                    	}
                    }
                    else {
                        alert("Invalid User ID or Password");
                        loaderWidget(false);
                    }
                },
                error: function (xhr, status, error) {
                    alert("Invalid User ID or Password");
                    loaderWidget(false);
                }
            });
        } else {
            alert("Must Fill in Username and Password to Login");
        }
    }
}

function AddToCart(itemno, qty, uom, specDetail, partNbr, tag, lineno, loadSavedOrder, width, length) {
     if (itemno !== "") {
		//loaderWidget(true, 'Adding to cart ...');
		$('#product-listings').empty();
		productsLoader(true, 'Adding to Cart...');
    	var specDetail = getSpecDetail('');
        if (loadSavedOrder != true) {
          setTimeout(function() {getURLAjaxXML("OrderEntryCartXML?itemno=" + itemno + "&q=" + qty + "&u=" + uom + "&s=" + specDetail + "&p=" + partNbr + "&t=" + tag + "&l=" + lineno+ "&wi=" + width+ "&le=" + length, loadCartValues,  true);
          //$('#product-listings').empty();
          },1000);
        } else {
          setTimeout(function() {getURLAjaxXML("OrderEntryCartXML?itemno=" + itemno + "&q=" + qty + "&u=" + uom + "&s=" + specDetail + "&p=" + partNbr + "&t=" + tag + "&l=" + lineno+ "&wi=" + width+ "&le=" + length, loadCartValues,  true); }, 1000);
        }
        return true;
     } else {
        alert("Please Select An Item");
        return false;
     }

     function loadCartValues(xmlDom) {
        if ($(xmlDom.childNodes[0]).attr('reccnt') === '0') {
            $('#message h3').text("Item # " + itemno + " is no longer available.");
            openPopup('message');
        }
        var node = xmlDom.childNodes[0];
        if (node.nodeName === "error") {
            alert('An Error Occured Loading Items Into Your Cart');
        } else {
            showNumCartItems();
            updateCartDisplay();
        }
        //loaderWidget(false)
        productsLoader(false);
        $('#product-listings').append('<h3 class="mt-3 open-sans-font fw-bold" id="locate-product-title">Use the Product Selector to locate a product.</h3>');
    }
}

function showNumCartItems() {
    var html = "";
    $.ajax({url: contextPath + "/OrderEntryCartXML?type=json",
        success: function (result, status, xhr) {
            if (result.length > 0) {
            	var numitems = 0;
                var idx = result.length;
                for (idx = 0; idx < result.length; idx++) {
                	if (result[idx].TAG == "") {
                	  numitems += 1;
                	}
                }
                $("#itemsNUM").html(numitems.toString());
            } else {
                $("#itemsNUM").html("0");
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function updateCartDisplay() {
	var desc           = null;
	var EXTPRC         = null;
    var cartTotal      = 0.00;
	var cartSubTotal   = 0.00;
    var cartSurcharge  = 0.00;
    var mLineNbr       = 0;
    $.ajax({url: contextPath + "/OrderEntryCartXML?type=json",
        success: function (result, status, xhr) {
            //console.log(result);
            if (Array.isArray(result)) {
                cartData = result;
                var rowClass = 'odd';

                if (result.length <= 0) {
                    $('table#cart-detail tbody').empty();
                    $('table#cart-detail tbody').append('<td colspan="7" class="note">Your cart is empty.</td>');
                    $('table#cart-totals td#cartSubtotal').empty();
                    $('table#cart-totals td#cartSubtotal').append('$0.00');
                    $('table#cart-totals td#cartSurcharge').empty();
                    $('table#cart-totals td#cartSurcharge').append('$0.00');
                    $('table#cart-totals td#cartTotal').empty();
                    $('table#cart-totals td#cartTotal').append('$0.00');
                } else {
                    $('table#cart-detail tbody').empty();
                    for (var i = 0; i < result.length; i++)  {
                        var rec = result[i];
                        
                        // If tag bypass display
                        if (typeof rec["TAG"] != 'undefined') { //Added 07/06/21
                          if (rec["TAG"].length > 1) {
                            continue;
                          }
                        }
                        mLineNbr += 1;
                        
                        if (rec["CATCODE"] === 'C') {
                            desc = rec["DESC"] + " (" + rec["WIDTH"] + "\" COIL)";
                        } else if (rec["WIDTH"]==='00000.0000') { 
                        	desc = rec["DESC"] + " (" + rec["LENGTH"] + "\")"; 
                        } else {
                            desc = rec["DESC"] + " (" + rec["WIDTH"] + "\" X " + rec["LENGTH"] + "\")";
                        }

                        if (rec["EXTPRC"] === 'ERR' || rec["EXTPRC"] === 'NaN') {
                            EXTPRC = ' ---';
                            
                        } else {
                            EXTPRC = formatCurrency(parseFloat(rec["EXTPRC"]));
                        }

                        //pjm 051415 - change from PRCUOM to UNITS to get the ordered UOM to show, instead of default 'LB'
                        // rec["DESC"].replace(/("|')/g, "") Removes double quotes or delete window will fail 
                        $('table#cart-detail tbody').append('<tr class="' + rowClass + '" row="' + i + '" item="' + rec["ITEMNO"] + '" uom="' + rec["UNITS"] + '" wid="' + rec["WIDTH"] + '" len="' + rec["LENGTH"] + '" comment="' + rec["MSG"] + '">');
                        $('table#cart-detail tbody').append('<td>' + desc + '</td>\\n');
                        $('table#cart-detail tbody').append('<td>' + rec["UNITS"] + '</td>');
                        $('table#cart-detail tbody').append('<td id="qty"><input onfocusout="updateCart(\' itmqty \', \'' + i + '\',this.value);" style="width:60px;"  type="number" name="qty1" id="qty1" row="'
                        		+ i + '" item="' + rec["ITEMNO"] + '" value="' + rec["QTY"] + '" /></td>');
                        // Display Price
                        if(isFlagIdSet("OE",9)) {
                          $('table#cart-detail tbody').append('<td>$' + EXTPRC + '</td>');
                        } else {
                          $('table#cart-detail tbody').append('<td>NA</td>');  
                        }
                        $('table#cart-detail tbody').append('<td><a href="" onclick="openPopup(\'itemComment\', ' + i + ', \''  + rec["DESC"].replace(/("|')/g,"") + '\');"><img id="' + rec["ITEMNO"] + '" src="images/comments.png" height="25" style="vertical-align:middle;"/></a></td>');
                        
                        // Ability to add USEDLINES
                        if(isFlagIdSet("OE",14)) {
                          var wDesc = rec["DESC"].replace(/("|')/g,"") + "_" + rec["QTY"] + "_" + rec["UNITS"] + "_" + mLineNbr +"_" + rec["CUSTITEM"];
                          $('table#cart-detail tbody').append('<td><a href="" onclick="openPopup(\'usedItemTags\',\'' + i + '\',\'' + wDesc + '\',\'' +i + '\',\'' + rec["ITEMNO"] + '\',\'' + rec["DIST"] + '\');"><img id="' + rec["ITEMNO"] + '" src="images/upload.png" height="25" style="vertical-align:middle;"/></a></td>');
                        } else {
                          $('table#cart-detail tbody').append('<td><a href="" onclick=""><img id="' + rec["ITEMNO"] + '" src="images/upload.png" height="25" style="vertical-align:middle; opacity:.3; cursor:default;"/></a></td>');                        	
                        }

                        $('table#cart-detail tbody').append('<td style="display:table-cell;"><a href="" onclick="openPopup(\'itemDelete\',' + i + ',\'' + rec["DESC"].replace(/("|')/g, "") + '\');"><img id="' + rec["ITEMNO"] + '" src="images/remove2.png" height="25" style="vertical-align:middle;"/></a></td>');
                        $('table#cart-detail tbody').append('<td style="display:table-cell;"><a href="" onclick="cloneRow(\''+rowClass+'\',\'' + rec["ITEMNO"] + '\',\'' + rec["UNITS"] + '\',\'' + rec["WIDTH"] + '\',\'' + rec["LENGTH"] + '\',\'' + rec["MSG"] + '\',\'' + desc.replace(/("|')/g, "") + '\',\'' + rec["QTY"] + '\',\'' + EXTPRC + '\',\'' + rec["DESC"].replace(/("|')/g, "") + '\',\'' + mLineNbr + '\',\'' + rec["CUSTITEM"] + '\',\'' + rec["DIST"] + '\');"><img id="' + rec["ITEMNO"] + '" src="images/replicate.png" height="25" style="vertical-align:middle;"/></a></td>');
                        $('table#cart-detail tbody').append('</tr>');
 
                        if (rowClass === 'odd') {
                            rowClass = 'even';
                        } else {
                            rowClass = 'odd';
                        }
                        cartSubTotal  = cartSubTotal  + parseFloat(rec["EXTPRC"]);
                        cartSurcharge = cartSurcharge + parseFloat(rec["SURCHRG"]);
                    }
                    
                    //Added 07/06/21
                    if (isNaN(cartSurcharge)) {
                      cartSurcharge = 0;	
                    }
                    cartTotal = cartSubTotal + cartSurcharge;
                    
           
                    cartTotal     = formatCurrency(cartTotal);
                    cartSubTotal  = formatCurrency(cartSubTotal);
                    cartSurcharge = formatCurrency(cartSurcharge);

                    if (cartTotal === 'NaN' || cartTotal === 'ERR') {
                        cartTotal = " ---";
                    }
                    if (cartSubTotal === 'NaN' || cartSubTotal === 'ERR') {
                        cartSubTotal = " ---";
                    }
                    if (cartSurcharge === 'NaN' || cartSurcharge === 'ERR') {
                        cartSurchage = " ---";
                    }
                    
                    $('table#cart-totals td#cartSubtotal').empty();
                    $('table#cart-totals td#cartSurcharge').empty();
                    $('table#cart-totals td#cartTotal').empty();
                    // View Pricing
                    if(isFlagIdSet("OE",9)) {
                    $('table#cart-totals td#cartSubtotal').append('$' + cartSubTotal);
                    $('table#cart-totals td#cartSurcharge').append('$' + cartSurcharge);
                    $('table#cart-totals td#cartTotal').append('$' + cartTotal);
                    } else {
                    $('table#cart-totals td#cartSubtotal').append('NA');
                    $('table#cart-totals td#cartSurcharge').append('NA');
                    $('table#cart-totals td#cartTotal').append('NA');
                    }
                }
            } else {
                alert(result.Error);
            }
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function setCartWidth() {
}

function cartItemDelete(idx) {
    loaderWidget(true, 'Removing item ...');
    getURLAjaxXML("OrderEntryCartXML?a=d&idx=" + idx, loadCartValues, true);

    function loadCartValues(xmlDom) {
        showNumCartItems();
        updateCartDisplay();
        $('#itemDelete').popup('close');
        loaderWidget(false);
    }
}

function updateCart(id, idx, changedValue){
	loaderWidget(true, 'Updating Cart ...');
    var qty = 0;
    // Line Comment
    if (id === 'itemComment') {
        qty = $("table#cart-detail tbody input[row=" + idx + "]").attr('value');
    // Changed Quantity
    } else {
    	qty = changedValue;
    }
    //alert(qty);
    var uom       = $("table#cart-detail tbody tr[row=" + idx + "]").attr('uom');
    var prcuom    = $("table#cart-detail tbody tr[row=" + idx + "]").attr('uom');    
    var modwidth  = $("table#cart-detail tbody tr[row=" + idx + "]").attr('wid');
    var modlength = $("table#cart-detail tbody tr[row=" + idx + "]").attr('len');
    var msg       = $('#itemComment #itmComment').val();
    
    updateCartItem(idx,qty,uom,modlength,modwidth,msg,"",prcuom);

    if (id === 'itemComment') {
        $('#' + id).popup('close');
    }
}

function emptyCart() {
    $.ajax({url: contextPath + "/OrderEntryCartXML?a=e",
        success: function (result, status, xhr) {
            //alert("SUCCESS");
        },
        error: function (xhr, status, error) {
            alert(error);
        }
    });
}

function clearInput(ele) {
    var eleVal = $(ele).val();
    tmpInput = eleVal;
    $(ele).val('');
}

var selItmIdx;

function padLeadingZeros(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

function addTagsSelected(){
	var checkboxes = document.getElementsByName('tagRow');
	var selected = [];
	var tagTotal = 0;
	for (var i=0; i<checkboxes.length; i++) {
	    if (checkboxes[i].checked) {
		    var tagSelectA = checkboxes[i].value.split("_");
	  	   	    tagTotal  += Number(tagSelectA[2]);
	  	   	    if (tagSelectA[6]=="") {
	  	   	      tagSelectA[6]="NO";
	  	   	    }
	  	   	    if (selected.length == 0) {
		          selected.push(tagSelectA);
	  	   	    } else {
	  	   	      selected.push("_" + tagSelectA);	
	  	   	    }
	    }
	};
	tagTotal  = Number(tagTotal).toFixed(3);
	AddToCart(selected[0][0],tagTotal,selected[0][3],'',selected[0][4],selected,selected[0][5],false,'-1','-1');
	closePopup("invView");
	closePopup("invTagView");
	alert('Item added to Shopping Cart.');
}

var tagInfo = "";
function setTagTotal(tagInfo){
	var tagInfoA   = tagInfo.split("_");
	var tagButton  = tagInfoA[0];
    var tagSelectA = [];
	var checkboxes = document.getElementsByName('tagRow');
    var tagTotal   = 0;
    
	for (var i=0; i<checkboxes.length; i++) {
	    if (checkboxes[i].checked) {
	      tagSelectA = checkboxes[i].value.split("_");
	      // If Daily Offerings (array element 6 contains Daily Offering selection) add tag to cart immediately after selection.
	      if (tagInfoA[1]=='DailyOfr') {
	    	 addTagsSelected();
	    	break;
	      }
	   	  tagTotal += Number(tagSelectA[2]);
	    }
	}
	// Not Daily Offering will be the same Item
	if (tagInfoA[1]=='NO') {
	  var btnObj = document.getElementById("addBtn");
	  if (tagTotal > 0) {
		  if(!document.getElementById('btnAdded')){
		    var element         = document.createElement("input");
		        element.id      = 'btnAdded'; 
		        element.type    = 'button';
		        element.value   = tagButton; 
		        element.addEventListener('click', addTagsSelected);
		        element.style.marginLeft = "25px";    
		    btnObj.appendChild(element);
		  }
	  } else {
		  btnObj.removeChild(document.getElementById("btnAdded"));		
	  }
	  document.getElementById("tagTotal").innerText = tagTotal.toFixed(3);
    }
}

function openPopup(id, idx, desc, ele, itemno, dist, partnbr, dailyofr) {
    if (id === 'itemComment') {
        var comment = $('#itemComment #itmComment').val();
        $('#itemComment a#ok').attr('onclick', 'updateCart("itemComment","'+ idx +'","'+ comment +'");');
    }
    if (id === 'itemDelete') {
        selItmIdx = idx;
        $('#itemDelete p#itmDesc').empty();
        $('#itemDelete p#itmDesc').append(desc);
    }    
    if (id === 'invalidInfo') {
        $('div#' + id + ' a').attr('onclick', 'closePopup("' + id + '", "focus", "' + ele + '");');
    }
    if (id === 'invView') {   
    	$('#h5invView').text(desc + ' ' + itemno);
        /*$('#invTable').empty();
                var row = "<tr class='border-bottom'><td colspan=3><a href='' onclick=showInvAllDist("+idx.length+");>Show All</a></td><td colspan=3><a href='' onclick=showInvFavDist("+idx.length+");>Show Favourite</a></td></tr>";
		var row  = row + "<tr class='border-bottom'>" +
				   "<th>District  </th>" +
				   "<th>Available </th>" +
				   "<th>UOM       </th>" +
				   "<th>Inbound   </th>" +
				   "<th>Price     </th>" +
				   "<th>UOM       </th></tr>";
    	$("#invTable").append(row);        
    	for (var i = 0; i < idx.length; i++) {                                
    		var rs = idx[i];
    		var dist = rs.DIST;
                var custDist = rs.CUSTDIST;
                //alert(dist+'---'+custDist);
    		var row  = "";
    		if ((rs.QTY > 0 && isFlagIdSet("OE",6)) || (isFlagIdSet("OE",14)))  {
    		  row = "<tr class='border-bottom' ";
                     if(custDist*1 === dist*1) row = row + "id = 'favdist" + i +"' ";
                     else row = row + "id = 'notfavdist" + i +"' style='visibility:collapse;' ";
                     row = row +"     >" +	
      		            "<td><a href='' onclick=openPopup('itemTags','','','','"+ itemno.trim() +"',"+ dist +",'"+ partnbr +"','"+ dailyofr +"');>"+ rs.DSTA + "</a></td>" +
    		  			"<td>"+ parseFloat(rs.QTY).toString()  +"</td>" +
    		  			"<td>"+ rs.IUOM +"</td>" +
    		  			"<td>"+ parseFloat(rs.OQTY).toString() +"</td>" +
    		  			"<td>"+ rs.PRC  +"</td>" +
    		  			"<td>"+ rs.UOM  +"</td></tr>";
    		}else{row = "<tr class='border-bottom' ";
                     if(custDist*1 === dist*1) row = row + "id = 'favdist" + i +"' ";
                     else row = row + "id = 'notfavdist" + i +"' style='visibility:collapse;' ";
                     row = row +"     >" + 
     					"<td>"+ rs.DSTA +"</td>" +
    					"<td>"+ parseFloat(rs.QTY).toString()  +"</td>" +
    					"<td>"+ rs.IUOM +"</td>" +
    					"<td>"+ parseFloat(rs.OQTY).toString() +"</td>" +
    					"<td>"+ rs.PRC  +"</td>" +
    					"<td>"+ rs.UOM  +"</td></tr>";
    		}
	    	$("#invTable").append(row);                                                                                                                                                                                                                      
	    };*/
	    // new stuff
	    var invFilters = `<div id="invViewFilters" class="d-flex justify-content-around">
				      <a href="" class="no-txt-decor small" onClick="showInvAllDist('`+idx.length+`');">Show All</a>
				      <a href="" class="no-txt-decor small" onClick="showInvFavDist('`+idx.length+`');">Show Favorite</a>
			      </div>`;
		$("#invContainer").append(invFilters,"<hr>");
		popupLoader("invContainer",false);
		
		for (var i = 0; i < idx.length; i++) {                                
    		var rs = idx[i];
    		var dist = rs.DIST;
            var custDist = rs.CUSTDIST;
    		var row  = "";
    		if ((rs.QTY > 0 && isFlagIdSet("OE",6)) || (isFlagIdSet("OE",14)))  {
				row = `<div class="ps-5 pe-5" `;
				if (custDist*1 === dist*1) {
					row = row + `id="favdist` + i +`"`;
				} else {
					row = row + `id="notfavdist` + i + `" style="display:none;"`;
				}
				row = row + `>
							<div class="d-flex align-items-center justify-content-between">
								<a href="" onClick="openPopup("itemTags","","","","`+itemno.trim()+`","`+dist+`","`+partnbr+`","`+dailyofr+`");">
									<span class="fs-5 col-2 fw-bold">` + rs.DSTA + `</span>
								</a>
								<div class="col-8 fs-6 fw-bold d-flex flex-column justify-content-center align-items-center"><span>`+parseFloat(rs.QTY).toString()+` Available</span><span>`+rs.PRC+`<span class="text-muted small fw-normal">/`+rs.UOM+`</span></span></div>
								<div class="d-flex flex-column small fw-bold">
					      			<span class="text-center">Inbound</span>
					      			<span class="text-center">`+parseFloat(rs.OQTY).toString()+`</span>
					      		</div>
				      		</div>
				      		<hr>
				      	</div>`;
			} else if (rs.QTY < 1 && rs.PRC < 0.1) {
				row = `<div class="ps-5 pe-5" `;
				if (custDist*1 === dist*1) {
					row = row + `id="favdist` + i +`"`;
				} else {
					row = row + `id="notfavdist` + i + `" style="display:none;"`;
				}
				row = row + `>
							<div class="d-flex align-items-center justify-content-between">
								<span class="fs-5 col-2 fw-bold">` + rs.DSTA + `</span>
								<span class="fs-6 col-8 text-center">None Available</span>
								<div class="d-flex flex-column small fw-bold">
					      			<span class="text-center">Inbound</span>
					      			<span class="text-center">`+parseFloat(rs.OQTY).toString()+`</span>
					      		</div>
				      		</div>
				      		<hr>
			      		</div>`;
			} else {
				row = `<div class="ps-5 pe-5" `;
				if (custDist*1 === dist*1) {
					row = row + `id="favdist` + i +`"`;
				} else {
					row = row + `id="notfavdist` + i + `" style="display:none;"`;
				}
				row = row + `>
							<div class="d-flex align-items-center justify-content-between">
								<span class="fs-5 col-2 fw-bold">` + rs.DSTA + `</span>
								<div class="col-8 fs-6 fw-bold d-flex flex-column justify-content-center align-items-center"><span>`+parseFloat(rs.QTY).toString()+` Available</span><span>`+rs.PRC+`<span class="text-muted small fw-normal">/`+rs.UOM+`</span></span></div>
								<div class="d-flex flex-column small fw-bold">
					      			<span class="text-center">Inbound</span>
					      			<span class="text-center">`+parseFloat(rs.OQTY).toString()+`</span>
					      		</div>
				      		</div>
				      		<hr>
			      		</div>`;
			}
			$("#invContainer").append(row);
		}
    } 
  
    if (id === 'itemTags' || id === 'usedItemTags') {
    	itemno    = itemno.padEnd(5);
    	dist      = (padLeadingZeros(dist, 2));
    	tagButton = 'Update';
    	tagInfo   = "";
    	if (dailyofr>"") {
    	  tagInfo ='Update_DailyOfr';
    	} else {
    	  tagInfo = 'Update_NO';
    	}
        var mline= "0";
       	var ul   = 'View';
  		//var row  = "<tr class='border-bottom'>";
       	var row  = "<tr class='border-bottom'>";
       	
        
  		// Update usedlines on order
    	if (id === 'usedItemTags') {
      	  row    += "<th>Update</th>"	
    	  id      = 'invView';
    	  descA   = desc.split("_");
    	  dsc     = descA[0];
    	  qty     = descA[1];
    	  qtyUom  = descA[2];
    	  mline   = descA[3];
    	  partnbr = descA[4];
    	  ul     = 'Usedlines';
    	  $('#h3invView').text(dsc + ' ' + itemno);
    	
    	// Add Mainline
    	} else if (isFlagIdSet("OE",14)) {
      	  row += "<th>Add</th>"		
      	  tagButton = 'Add';
      	  tagInfo   = "";
    	  if (dailyofr>"") {
    	    tagInfo = 'Add_DailyOfr';
    	  } else {
    	    tagInfo = 'Add_NO';
    	  }
    	} else {
    	  row += "<th></th>"
    	}
        // Allow Add/Update Tags 
    	if (isFlagIdSet("OE",14)) {
          $('#h3invView').append("<div id='addBtn'><span></span>" +
        	                     "<span> Selected Tag Total : </span>" +
        	                     "<span id=\"tagTotal\">0.000</span></div>");
    	}
    	row += "<th>Mine    </th>" +
		       "<th>Tags    </th>" +
		       "<th>Width   </th>" +
		       "<th>Length  </th>" +
		       "<th>Heat#   </th>" +
		       "<th>Mill ID#</th>" +
		       "<th>LOC     </th>" +
		       "<th>Quantity</th>" +
		       "<th>UOM     </th>" +
		       "<th>Pieces  </th></tr>"
    	$('#invTable').empty(); 
    	$("#invTable").append(row); 
    	
    	var wInvViewTags = "invViewTags_" + ul;
		var displayData = $.ajax({url: contextPath + "/OrderEntryJSON",
		    type: "POST",                                              
		    data: {"action": wInvViewTags,                              
		    	   "distno": dist,
		    	   "itemno": itemno,
		    	   "dailyofr": dailyofr},
			dataType: "json",                                          
			success: function (result) {

			for (var i = 0; i < result.length; i++) {                                
		    	var rs = result[i]; 
		    	var row  = "<tr>" +
	    		"<td colspan='2'></td><td colspan='8' style='text-align: left'>"+ rs.ITTDES +"</td>" + 
	            "<td>"+ rs.ITUDT1 +"</td></tr>"; 
		    	$("#invTable").append(row);
		    	row  = "<tr class='border-bottom'>";
		    	// Add usedline to order
			    if ((ul == 'Usedlines') && (isFlagIdSet("OE",14))) {
    		      // Check if Tag already added to cart	
			      if (rs.QUOTES == 'NO') {
				    var tagSelect = rs.ITITEM +"_"+ rs.ITTAG +"_"+ rs.ITTQTY +"_"+ rs.ITTUOM +"_"+ partnbr +"_"+ mline +"_"+ dailyofr +"_"+ rs.ITWDTH +"_"+ rs.ITLNTH +"_"+ rs.ITTPCS;
					tagAddUpd = 'Update';
				    row += "<td><input type='checkbox' name='tagRow' id='tagRow' value='" + tagSelect + "' onclick='setTagTotal(tagInfo)'></input></td>"    
				    row += "<td>"+ rs.MINE  +"</td>"
				    row += "<td><a href=#>"+ rs.ITTAG  +"</a></td>"
				  } else {
					row += "<td><input type='checkbox' disabled></input></td>"
				    row += "<td>"+ rs.MINE  +"</td>" 
					row += "<td>"+ rs.ITTAG +"</td>"
				  }	
			    // Create 
		        } else if ((tagButton == 'Add') && (isFlagIdSet("OE",14))) {
    		      // Check if Tag already added to cart
		          if (rs.QUOTES == 'NO') {
		    		var tagSelect = rs.ITITEM +"_"+ rs.ITTAG +"_"+ rs.ITTQTY +"_"+ rs.ITTUOM +"_"+ partnbr +"_"+ mline +"_"+ dailyofr +"_"+ rs.ITWDTH +"_"+ rs.ITLNTH +"_"+ rs.ITTPCS;
		    		tagAddUpd = 'Add';
					row += "<td><input type='checkbox' name='tagRow' id='tagRow' value='" + tagSelect + "' onclick='setTagTotal(tagInfo)'></input></td>"   
				    row += "<td>"+ rs.MINE  +"</td>"
					row += "<td><a href=#>"+ rs.ITTAG  +"</a></td>"
		    	  } else {
				    row += "<td><input type='checkbox' disabled></input></td>" 
					row += "<td>"+ rs.MINE  +"</td>"
				    row += "<td>"+ rs.ITTAG +"</td>"
		    	  }		    		  
		    	  // All else
		        } else {
				   row += "<td><input type='checkbox' disabled></input></td>"
				   row += "<td>"+ rs.MINE  +"</td>"	 
		    	   row += "<td>"+ rs.ITTAG +"</td>"
		    	} 
		    	// Linear  
		    	if (rs.ITWDTH == '0.0000') {
		    	  row += "<td></td>"
		    	} else {
		    	  row += "<td>"+ rs.ITWDTH +"</td>"
		    	}
		    	// Coil
		    	if (rs.ITLNTH == '0.0000') {
		    	  row += "<td></td>"
	    		} else {
		    	  row += "<td>"+ rs.ITLNTH +"</td>"
	    		}
		    	       	    	       				    	
		    	// View Test Reports
		        var wHEATLNK  = '';		    	       
		        var wHEAT     = encodeURIComponent(rs.ITHEAT.trim()).replace(/%20/g,'+');
                if (rs.CERTFLAG == '1') {                	   
                   wHEATLNK = '<a href=/'+rs.CUSTOM+'/pdfdoc?type=cert&val1=' + rs.ITTAG + '&val2=' + itemno + '&val3=' + dist + ' target="_blanks">' + wHEAT + '</a>'  
                } else {
              	  wHEATLNK = wHEAT;
                }		    	
		    	
                row += "<td>"+ wHEATLNK  +"</td>" +
		    		   "<td>"+ rs.ITV301 +"</td>" +
		    	       "<td>"+ rs.ITLOCT +"</td>" +
		    	       "<td>"+ parseFloat(rs.ITTQTY).toString() +"</td>" +
		    	       "<td>"+ rs.ITTUOM +"</td>" +
		    	       "<td>"+ rs.ITTPCS.replace(/^0+/, '') +"</td></tr>";
			    	$("#invTable").append(row);
			    	
			    
			    };
				},
			});
    }
      
    if (id === 'invTagView') {
        	itemno    = itemno.padEnd(5);
        	dist      = (padLeadingZeros(dist, 2));
            var mline = "0";
           	var ul    = 'View';
	        tagButton = 'Add';
	      	tagInfo   = "";
	    	if (dailyofr>"") {
	    	  tagInfo = 'Add_DailyOfr';
	    	} else {
	    	  tagInfo = 'Add_NO';
	    	}
           	var row   = "";
          	
        	var wInvViewTags = "invViewTags_" + ul;
    		var displayData = $.ajax({url: contextPath + "/OrderEntryJSON",
    		    type: "POST",                                              
    		    data: {"action"  : wInvViewTags,                              
    		    	   "distno"  : dist,
    		    	   "itemno"  : itemno,
    		    	   "dailyofr": dailyofr},
    			dataType: "json",                                          
    			success: function (result) {
    				
    	        // Popups.jsp header
    	        $('#h3invTagView').empty();   
    	        $('#h3invTagView').append("<div id='addBtn'><span></span>" +
    	                                  "<span> Selected Tag Total : </span>" +
    	                                  "<span id=\"tagTotal\">0.000</span></div>");
    	    	 
    	        $('#invTagTable').empty(); 
		    	var rs = result[0];
    	        row  = "<tr class='border-bottom'><th colspan='10'>"+ rs.T2CMNT +"</th></tr>"
    	        $("#invTagTable").append(row);
    	        // TR and TH syle from Order_Entry3.jsp
    	        row  = "<tr ><th colspan='5'>Tag Description</th>"      +
    	                   "<th colspan='3'>Price          </th></tr>" +
    	      	       "<tr class='border-bottom'><th>Add</th>"                              +
    	    	           "<th>Tags    </th>"                         +
    	    	           "<th>Width   </th>"                         +
    	    	           "<th>Length  </th>"                         +
    	    	           "<th>Heat#   </th>"                         +
    	    	           "<th>Mill ID#</th>"                         +
    	    	           "<th>LOC     </th>"                         +
    	    	           "<th>Quantity</th>"                         +
    	    	           "<th>UOM     </th>"                         +
    	    	           "<th>Pieces  </th></tr>"
    	        $("#invTagTable").append(row);    				
    				
    			for (var i = 0; i < result.length; i++) {                                
    		    	var rs = result[i]; 
    			    
    		    	// Tag Description (T1CMNT TAGCMNT and ITUDT2 Price)
                    row  = "<tr><td colspan='5'>"+ rs.ITTDES +"</td>" + 
                               "<td colspan='3'>"            + rs.ITUDT1 +"</td></tr>"; 
    			    $("#invTagTable").append(row);  
    			    
    			    // Tag Detail
    		    	row  = "<tr class='border-bottom'>"
    		    	var tagSelect = rs.ITITEM +"_"+ rs.ITTAG +"_"+ rs.ITTQTY +"_"+ rs.ITTUOM +"_"+ partnbr +"_"+ mline +"_"+ dailyofr+ "_"+ rs.ITWDTH +"_"+ rs.ITLNTH +"_"+ rs.ITTPCS;
    		    	tagAddUpd = 'Add';
    		    	// Check if Tag already added to cart
  		    	    if (rs.QUOTES == 'NO' && rs.ITTQTY>0) {
    				  row += "<td><input type='checkbox' name='tagRow' id='tagRow' value='" + tagSelect + "' onclick='setTagTotal(tagInfo)'></input></td>"   
      				  row += "<td><a>"+ rs.ITTAG  +"</a></td>"
  		    	    } else {
  				      row += "<td><input type='checkbox' disabled></input></td>"
  	    			  row += "<td><a>"+ rs.ITTAG.fontcolor("grey") +"</a></td>" 
  		    	    }
  		    	    // Linear  
    		    	if (rs.ITWDTH == '0.0000') {
    		    		row += "<td></td>"
    		    	} else {
    		    	  row += "<td>"+ rs.ITWDTH +"</td>"
    		    	}
    		    	// Coil
    		    	if (rs.ITLNTH == '0.0000') {
    		    	  row += "<td></td>"
    	    		} else {
    		    	  row += "<td>"+ rs.ITLNTH +"</td>"
    	    		}
    		          	    	       				    	
    		    	// View Test Reports
    		        var wHEATLNK  = '';		    	       
    		        var wHEAT     = encodeURIComponent(rs.ITHEAT.trim()).replace(/%20/g,'+');
                    if (rs.CERTFLAG == '1') {                	   
                       wHEATLNK = '<a href=/'+rs.CUSTOM+'/pdfdoc?type=cert&val1=' + rs.ITTAG + '&val2=' + itemno + '&val3=' + dist + ' target="_blanks">' + wHEAT + '</a>'  
                    } else {
                  	  wHEATLNK = wHEAT;
                    }		    	    
    			    row += "<td>"+ wHEATLNK  +"</td>" +
    		    		   "<td>"+ rs.ITV301 +"</td>" +
    		    	       "<td>"+ rs.ITLOCT +"</td>" +
    		    	       "<td>"+ parseFloat(rs.ITTQTY).toString() +"</td>" +
    		    	       "<td>"+ rs.ITTUOM +"</td>" +
    		    	       "<td>"+ rs.ITTPCS.replace(/^0+/, '') +"</td></tr>";
    			    $("#invTagTable").append(row);
    			}
    			}
    		 })
         }
    	 
    	 if (id != 'invView') {
			 // Turn off Loading and POPUP ID#	
	         loaderWidget(false);
	         // Open for openPopup    
	         $('#' + id).popup('open'); 
		 }
}

function closePopup(id, action, ele) {
    $('#' + id).popup('close');
    if (action === "focus") {
        $( "#" + id ).on( "popupafterclose", function( event, ui ) {
            document.getElementById(ele).focus();
        } );

    }
}

function classCorrection(id) {
    // pjm 050715 Manipulate class for selectmenu items
    $('#grid1 div.ui-select a#' + id + '-button').removeClass('ui-li-has-count');
    //$('#grid1 div.ui-select div#lbl- div.ui-select').addClass('ui-mini ');
    $('#grid1 div.ui-select a#' + id + '-button').addClass('ui-state-disabled');
}

function enableButton(status, id) {
    if (status) {
        $('a#' + id).removeClass('ui-state-disabled');
    } else {
        $('a#' + id).addClass('ui-state-disabled');
    }
}

function displayError(msg) {
    $('table#product-detail thead').empty();
    $('table#product-detail tbody').empty();
    $('table#product-detail thead').append('<tr><th>' + msg + '</th></tr>');
}

function loadSignInStatus() {
    if (loggedIn) {
        $("span#signin-status").text("Signed in: " + customerName);
        $("a#btnLogout").removeClass('hide');
        $("a#btnLogin").addClass('hide');
    }
}

function bootstrapUiFix() {
    $(".bs-btn").removeClass("ui-btn ui-shadow ui-corner-all");
    $(".reset>div, .reset>div>div").removeClass("ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset");
}

function reloadPage(type) {
	if (type != null && type == true) {
      location.reload(true);
	} else {
	  location.reload();
	}
    bootstrapUiFix();
}

function jsonLogout() {
    loaderWidget(true, "Signing Out...");
    $.ajax({url: contextPath + "/AcctUserAjax",
        type: "POST",
        data: {"Action": "logout"},
        success: function (result, status, xhr) {
            if (result.AuthStatus === '0') {
                $("a#btnAcctMenu").addClass('hide');
                $("a#btnChatNow").addClass('hide');
                $("a#btnNavMenu").addClass('hide');           	
                window.location.replace(cleanURL);
            }
            else {
                displayError("Error encountered when signing out. (E1)");
                $('#logoutConfirm').popup("close");
                loaderWidget(false);
            }
        },
        error: function (xhr, status, error) {
            //console.log(status);
            //console.log(error);
            displayError("Error encountered when signing out. (E2)");
            $('#logoutConfirm').popup("close");
            loaderWidget(false);
        }
    });
}

var cleanURL;
function getCleanURL () {
	var fullURL = window.location.href;
    if (fullURL.search("#&")) {
        var tmpURL = fullURL.split("#&");
        cleanURL = tmpURL[0];
    }
}

var baseURL;
function getBaseURL () {
    baseURL = '';
    var tmpURL = cleanURL.split('/');
    for (var i=0; i < tmpURL.length - 1; i++) {
        if (i !== 1) {
            if (i === 0) {
                baseURL = baseURL + tmpURL[i] + '//';
            } else {
                baseURL = baseURL + tmpURL[i] + '/';
            }
        }
    }
}

function checkUOMStatus() {
    if (!uomLoadStatus) {
        // UOM Load Has Completed With An Error
        if (uomLoadError !== "") {
            displayError(uomLoadError);
            uomLoadError = "";
            loaderWidget(false);
        }
        // UOM Load Has Not Completed Yet
        else {
            setTimeout(checkUOMStatus, 2000);
        }
    } else {
        if (uomFetchStatus) {
            // Enable next select list
            enableSelect('uom');
            enableLabel('uom', true);
            loaderWidget(false);
            $('select#uom').trigger("change");
        } else {
            loaderWidget(true, "Loading UOM...");
            setTimeout(enableUOMDelay, 2000);
            function enableUOMDelay() {
                enableSelect('uom');
                enableLabel('uom', true);
                loaderWidget(false);
                $('select#uom').trigger("change");
            }
        }
    }
}

function getSpecDetail(format) {
    // Loop through selected items
	var i = null;
    var specArr = [];
    $("select#sspec :selected").map(function (i, el) {
        specArr[i] = $(el).val();
    });

    var _sspec2 = '';
    if (format === 'a') {
        _sspec2 = '<spec>';
        for (i = 0; i < specArr.length; i++) {
            //var tag = (i === 0) ? "<spec>" : "";
            var split = (i === specArr.length - 1) ? "" : " / ";
            var lineBrk = (i === specArr.length - 1) ? "</spec><br />" : "";
            _sspec2 += (specArr[i] === "none") ? "</spec>" : specArr[i] + split + lineBrk;
        }
    } else {
        for (i = 0; i < specArr.length; i++) {
            var split = (i === specArr.length - 1) ? "" : " / ";
            _sspec2 += (specArr[i] === "none") ? "" : specArr[i] + split;
        }
    }

    return _sspec2;
}

function loadSavedCart(CartID, CartType) {
    loaderWidget(true, 'Loading Cart...');
    $.ajax({url: contextPath + "/OrderEntryCartXML?type=json&cid="+CartID+"&t="+CartType, 	
        success: function (result, status, xhr) {
            showNumCartItems();
            updateCartDisplay();
            loaderWidget(false);
            $('#shop-cart').panel("open");
        },
        error: function (xhr, status, error) {
            alert(error);
            loaderWidget(false);
        }
    });
}

function loadSavedOrder(orderNo, orderType) {
	// Call back happens 2 times in job stream and doubles count (1st time through only reads 1 item). 
	// Divide by 2 will solve problem with the number of calls to AddToCart()
    var rowctr = ($('div#order-items div[data-role="collapsible"]').length)/2;
    $('div#order-items div[data-role="collapsible"]').each(function (i, el) {    	
      if (i < rowctr) {
        var itemNo     = $(this).find('td#itemNo').text();
        var qty        = $(this).find('td#qty').text();
        var uom        = $(this).find('td#uom').text();
        var specDetail = "";
        var partno     = "";
        var tag        = "";
        var lineno     = "";
        AddToCart(itemNo, qty, uom, specDetail, partno, tag, lineno, true,'-1','-1');
      };
    });
    showNumCartItems();
    updateCartDisplay();
    $('#shop-cart').panel("open");
}

function checkCart(fileName) {
    var cartData = $('table#cart-detail tbody td').text();
    if (cartData !== 'Your cart is empty.') {
        window.location = baseURL + fileName;
    } else {
        $('#message h3').text("There are no items in your cart.");
        openPopup('message');
    }

}

var isMobile;
function detectMobile() {
    isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
}

function validateSelect(id) {
    if ($('select#' + id).val() !== "none") {
        $('label[for="' + id + '-button"]').removeClass('invalid');
        $('span#' + id + '-button span.ui-icon').removeClass('invalid');
        $('span#' + id + '-button').removeClass('invalid');
        $('span#' + id + '-button span.ui-icon').addClass('valid');
        $('span#' + id + '-button').addClass('valid');
    } else {
        $('span#' + id + '-button span.ui-icon').removeClass('valid');
        $('span#' + id + '-button').removeClass('valid');
    }
}

function formatCurrency(value) {
    value = numeral(value).format('0,0.00');
    return value;
}

function uiMod(reverse) {

    if (reverse === true) {
        var tmp = width;
        width = height;
        height = tmp;
    }

    // Phone (less than 500 px resolution considered a phone)
    /*if (width <= 500) {
        // Change Search button to be smaller (icon only button)
        $('div#hdrPanel a.ui-btn').addClass('ui-btn-icon-notext');
        $('div#hdrPanel a.ui-btn').removeClass('ui-btn-icon-left');
        $('div#hdrPanel').trigger('create');
    } else {
        $('div#hdrPanel a.ui-btn').removeClass('ui-btn-icon-notext');
        $('div#hdrPanel a.ui-btn').addClass('ui-btn-icon-left');
        $('div#hdrPanel').trigger('create');
    }*/

}

function setGridHeight(reverse) {

    if (reverse === true) {
        var tmp = width;
        width = height;
        height = tmp;
    }

    var gridHeight = height - 200;
    $('div#gridWrapper').css('height', gridHeight);
    //$('div#grid2').css('height', gridHeight);

}
            
function setDetailPanel() {
    //alert(width);
    if (height > 644) {
        $('div#grid2').css('width', width - 315);
    } else {
        $('div#grid2').css('width', width - 325);
    }
}

function getWindowDimensions() {
    width = $(window).width();
    height = $(window).height();
}


// ---------------------------------------------------------------------------------------
// ---------------------------------- CHECKOUT PAGE --------------------------------------
// ---------------------------------------------------------------------------------------

function getCustInfo(frtTerms) {
	var frtArray = frtTerms.split(",");
	for (var i=0; i< frtArray.length; i++) {
		var frtRec  = frtArray[i].split("=");
	    var frtCode = frtRec[0].replace("{","");
	    var frtDesc = frtRec[1].replace("}","");
	    $('select#ship-freight').append('<option value="' + frtCode + '">' + frtDesc + '</option>');
	}

    $.ajax({url: contextPath + "/OECheckOutAjax",
        type: "POST",
        data: {"a": "3"},
        dataType: "json",
        success: function (result, status, xhr) {    	
            // Load Billing Informaton
        	if (result.GuestUser != "") {
              $('input#bill-name').val(result.GuestUser);
              $('input#bill-phone').val(result.GuestPhone);
              $('input#bill-email').val(result.GuestEmail);
        	} else {
              $('input#bill-name').val(ecccnt);
              $('input#bill-phone').val(eccphn);
              $('input#bill-email').val(eccce);
        	}
        	$('select#quote-order option[value="none"]').removeAttr('selected');
        	$('select#quote-order').val(result.QuoteOrder).selectmenu("refresh");
            $('input#bill-company').val(result.CustName);
            $('input#bill-address').val(result.Address);
            $('input#bill-city').val(result.City);
            $('select#bill-state option[value="none"]').removeAttr('selected');
            $('select#bill-state').val(result.State).selectmenu("refresh");
            $('input#bill-zip').val(result.Zip);


            // Load Shipping Informaton
        	if (result.GuestUser != "") {
              $('input#ship-name').val(result.GuestUser);
              $('input#ship-phone').val(result.GuestPhone);
              $('input#ship-email').val(result.GuestEmail);
          	} else {
              $('input#ship-name').val(ecccnt);
              $('input#ship-phone').val(eccphn);
              $('input#ship-email').val(eccce);
          	}
            $('input#ship-company').val(result.CustName);
            $('input#ship-address').val(result.Address);
            $('input#ship-city').val(result.City);
            $('select#ship-state option[value="none"]').removeAttr('selected');
            $('select#ship-state').val(result.State).selectmenu("refresh");
            $('input#ship-zip').val(result.Zip);
            $('select#ship-freight option[value="none"]').removeAttr('selected');
            $('select#ship-freight').val(result.Freight).selectmenu("refresh");

            validateSelect('quote-order');
            validateSelect('bill-state');
            validateSelect('ship-state');
            validateSelect('ship-freight');

            getCheckout();
        },
        error: function (xhr, status, error) {
            alert("Customer Information Not Found!");
            loaderWidget(false);
        }
    });
}

function loadStates () {
    var states = [];
    states[0] = {NAME:"Alabama", ABBR:"AL"};
    states[1] = {NAME:"Alaska", ABBR:"AK"};
    states[2] = {NAME:"Arizona", ABBR:"AZ"};
    states[3] = {NAME:"Arkansas", ABBR:"AR"};
    states[4] = {NAME:"California", ABBR:"CA"};
    states[5] = {NAME:"Colorado", ABBR:"CO"};
    states[6] = {NAME:"Connecticut", ABBR:"CT"};
    states[7] = {NAME:"Delaware", ABBR:"DE"};
    states[8] = {NAME:"District of Columbia", ABBR:"DC"};
    states[9] = {NAME:"Florida", ABBR:"FL"};
    states[10] = {NAME:"Georgia", ABBR:"GA"};
    states[11] = {NAME:"Hawaii", ABBR:"HI"};
    states[12] = {NAME:"Idaho", ABBR:"ID"};
    states[13] = {NAME:"Illinois", ABBR:"IL"};
    states[14] = {NAME:"Indiana", ABBR:"IN"};
    states[15] = {NAME:"Iowa", ABBR:"IA"};
    states[16] = {NAME:"Kansas", ABBR:"KS"};
    states[17] = {NAME:"Kentucky", ABBR:"KY"};
    states[18] = {NAME:"Louisiana", ABBR:"LA"};
    states[19] = {NAME:"Maine", ABBR:"ME"};
    states[20] = {NAME:"Maryland", ABBR:"MD"};
    states[21] = {NAME:"Massachusetts", ABBR:"MA"};
    states[22] = {NAME:"Michigan", ABBR:"MI"};
    states[23] = {NAME:"Minnesota", ABBR:"MN"};
    states[24] = {NAME:"Mississippi", ABBR:"MS"};
    states[25] = {NAME:"Missouri", ABBR:"MO"};
    states[26] = {NAME:"Montana", ABBR:"MT"};
    states[27] = {NAME:"Nebraska", ABBR:"NB"};
    states[28] = {NAME:"Nevada", ABBR:"NV"};
    states[29] = {NAME:"New Hampshire", ABBR:"NH"};
    states[30] = {NAME:"New Jersey", ABBR:"NJ"};
    states[31] = {NAME:"New Mexico", ABBR:"NM"};
    states[32] = {NAME:"New York", ABBR:"NY"};
    states[33] = {NAME:"North Carolina", ABBR:"NC"};
    states[34] = {NAME:"North Dakota", ABBR:"ND"};
    states[35] = {NAME:"Ohio", ABBR:"OH"};
    states[36] = {NAME:"Oklahoma", ABBR:"OK"};
    states[37] = {NAME:"Oregon", ABBR:"OR"};
    states[38] = {NAME:"Pennsylvania", ABBR:"PA"};
    states[39] = {NAME:"Puerto Rico", ABBR:"PR"};
    states[40] = {NAME:"Rhode Island", ABBR:"RI"};
    states[41] = {NAME:"South Carolina", ABBR:"SC"};
    states[42] = {NAME:"South Dakota", ABBR:"SD"};
    states[43] = {NAME:"Tennessee", ABBR:"TN"};
    states[44] = {NAME:"Texas", ABBR:"TX"};
    states[45] = {NAME:"Utah", ABBR:"UT"};
    states[46] = {NAME:"Vermont", ABBR:"VT"};
    states[47] = {NAME:"Virginia", ABBR:"VA"};
    states[48] = {NAME:"Washington", ABBR:"WA"};
    states[49] = {NAME:"West Virginia", ABBR:"WA"};
    states[50] = {NAME:"Wisconsin", ABBR:"WI"};
    states[51] = {NAME:"Wyoming", ABBR:"WY"};

    for (s in states) {
        $('select#bill-state').append('<option value="' + states[s].ABBR + '">' + states[s].NAME + '</option>');
        $('select#ship-state').append('<option value="' + states[s].ABBR + '">' + states[s].NAME + '</option>');
    }
}

function loadOrderTypes () {
    var ordertypes = [];
    ordertypes[0] = {TYPE:"QUOTE"};
    if ((optFlags["OE"][0][2]) == "1") {
      ordertypes[1] = {TYPE:"ORDER"};
    };

    for (s in ordertypes) {
        $('select#quote-order').append('<option value="' + ordertypes[s].TYPE + '">' + ordertypes[s].TYPE + '</option>');
    }
}

function copyBillInfo (yes) {
    if (yes) {
        var state = $('select#bill-state').val();
        $('input#ship-name').val($('input#bill-name').val());
        $('input#ship-company').val($('input#bill-company').val());
        $('input#ship-address').val($('input#bill-address').val());
        $('input#ship-city').val($('input#bill-city').val());
        $('select#ship-state').val(state).selectmenu("refresh");
        $('input#ship-state').val($('input#bill-state').val());
        $('input#ship-zip').val($('input#bill-zip').val());
        $('input#ship-phone').val($('input#bill-phone').val());
        $('input#ship-email').val($('input#bill-email').val());
    } else {
        $('input#ship-name').val("");
        $('input#ship-company').val("");
        $('input#ship-address').val("");
        $('input#ship-city').val("");
        $('select#ship-state').val("none").selectmenu("refresh");
        $('input#ship-state').val("");
        $('input#ship-zip').val("");
        $('input#ship-phone').val("");
        $('input#ship-email').val("");
    }
    validateSelect('ship-state');
}

function getCheckout (placeOrder) {
    var orderFrm = [];
    orderFrm = {
    	"value(quoteorder)":$("#quote-order :selected").text(),
        "value(billaddr)":$('input#bill-address').val(),
        "value(billcity)":$('input#bill-city').val(),
        "value(billcomp)":$('input#bill-company').val(),
        "value(billemail)":$('input#bill-email').val(),
        "value(billname)":$('input#bill-name').val(),
        "value(billphone)":$('input#bill-phone').val(),
        "value(billstate)":$('select#bill-state').val(),
        "value(billzip)":$('input#bill-zip').val(),
        "value(ccname)":"",
        "value(ccnum)":"",
        "value(cctype)":"",
        "value(comment)":$('textarea#comments').val(),
        "value(cvv2code)":"",
        "value(orderNumber)":"",
        "value(ponum)":$('input#po-number').val(),
        "value(reqdate)":$('input#required-by').val(),
        "value(shipaddr)":$('input#ship-address').val(),
        "value(shipcity)":$('input#ship-city').val(), 
        "value(shipcomp)":$('input#ship-company').val(),
        "value(shipemail)":$('input#ship-email').val(),
        "value(shipname)":$('input#ship-name').val(),
        "value(shipphone)":$('input#ship-phone').val(),
        "value(shipstate)":$('select#ship-state').val(),
        "value(shipzip)":$('input#ship-zip').val(),
        "value(shipfreight)":$('select#ship-freight').val(),
        "value(shipcarrier)":$('input#ship-carrier').val(),
        "value(shippack)":$('textarea#package-instructions').val(),
        "value(submitAction)":"submitcart"
    };

    if (placeOrder) {
        $.ajax({url: contextPath + "/OECheckOutAjax?a=7",
            type: "POST",
            data: orderFrm,
            dataType: "json",
            success: function (result, status, xhr) {
                emptyCart();
                loaderWidget(false);
                openPopup("orderSubmit");
            },
            error: function (xhr, status, error) {
                alert("There was an error processing your order!\nPlease try again or contact support..");
                loaderWidget(false);
            }
        });     
    } else {
        $.ajax({url: contextPath + "/OECheckOutAjax?a=1",
            type: "POST",
            data: orderFrm,
            dataType: "json",
            success: function (result, status, xhr) {
                // View Pricing
                if(isFlagIdSet("OE",9)) {
                $('td#cartSurcharge').text('$' + formatCurrency(result.OrderSurcharge));	
                $('td#cartSubtotal').text('$' + formatCurrency(result.OrderSales));
                $('td#cartTax').text('$' + formatCurrency(result.OrderTax));
                $('td#cartShipping').text('$' + formatCurrency(result.OrderShipping));
                $('td#cartTotal').text('$' + formatCurrency(result.OrderTotal));
                if(result.OrderCombinable == "true") {
                    $('th#cartCombinableH').text('Discount:');
                    $('td#cartCombinableD').text('Included');
                }else{
                	$('th#cartCombinableH').text('');	
                	$('td#cartCombinableD').text('')
                };
                } else {
                $('td#cartSurcharge').text('NA');
                $('td#cartSubtotal').text('NA');
                $('td#cartTax').text('NA');
                $('td#cartShipping').text('NA');
                $('td#cartTotal').text('NA');
                $('th#cartCombinableH').text('')
                $('td#cartCombinableD').text();
                };

                $('span#ordernum').text(result.OrderNo);

                loaderWidget(false);
            },
            error: function (xhr, status, error) {
                alert("No Shopping Cart Found!\nUse the Product Selector to add a product.");
                loaderWidget(false);
                //window.location.assign(contextPath + "/order_entry3.jsp");
                window.location.assign(contextPath + "/index.jsp");
            }
        });
    }
}

function saveCart() {
    loaderWidget(true, "Saving Cart...");
    closePopup('saveCart');
    var cartName = $('input#cartName').val();
    $.ajax({url: contextPath + "/OECheckOutAjax?a=5&cn=" + cartName,
        type: "POST",
        dataType: "json",
        success: function (result, status, xhr) {
            emptyCart();
            loaderWidget(false);
            openPopup('cartSaved');
        },
        error: function (xhr, status, error) {
            alert("Could not save cart!\nPlease try again or contact support.");
            loaderWidget(false);
        }
    });
}

function cancelOrder() {
    loaderWidget(true, "Canceling Order...");
    closePopup('orderCancel');
    $.ajax({url: contextPath + "/OECheckOutAjax?a=6",
        type: "POST",
        dataType: "json",
        success: function (result, status, xhr) {
            emptyCart();
            //window.location.assign(contextPath + "/order_entry3.jsp");
            window.location.assign(contextPath + "/index.jsp");
        },
        error: function (xhr, status, error) {
            alert("Could not cancel order!\nPlease try again or contact support.");
            loaderWidget(false);
        }
    });
}

function enableForm(module, enable) {
    if (enable) {
        $('#' + module + ' input[type="text"]').textinput('enable');
        if (module === "payment") {
            $('#' + module + ' select#cc-type').selectmenu('enable');
        }
        //$('#checkout #' + module + ' .ui-select').css('border', '#CCC solid 1px');
    } else {
        $('#' + module + ' input[type="text"]').textinput('disable');
        if (module === "payment") {
            $('#' + module + ' select#cc-type').selectmenu('disable');
        }
        //$('#checkout #' + module + ' .ui-select').css('border', '#CCC solid 1px');
    }
}

function enableLabelMod(module, enable) {
    if (enable) {
        $('#' + module + " label").addClass('active');
    } else {
        $('#' + module + " label").removeClass('active');
    }
}
function validateOrder() {
    // Submit Form for Purpose of HTML5 Validation
    $('form#order-info').submit();
}

function processOrder() {
    loaderWidget(true, "Processing Order...");
    getCheckout(true);
    /*$.ajax({url: contextPath + "/OECheckOutAjax?a=6",
        type: "POST",
        dataType: "json",
        success: function (result, status, xhr) {
            emptyCart();
            window.location.assign(contextPath + "/order_entry3.jsp");
        },
        error: function (xhr, status, error) {
            alert("Could not cancel order!\nPlease try again or contact support.");
            loaderWidget(false);
        }
    });*/
}



// ---------------------------------------------------------------------------------------
// ---------------------------------- OPEN ORDERS PAGE --------------------------------------
// ---------------------------------------------------------------------------------------

function getOpenQuotes() {  
    loaderWidget(true, "Loading Open Quotes...");
    $.ajax({url: contextPath + "/OrderEntryItemsXML",
        type: "POST",
        data: {"it": "Q", "type": "json"},
        dataType: "json",
        success: function (result, status, xhr) {
           //console.log(result);
		   var rowClass = 'odd';
		   $('table#product-detail tbody').empty();
		   $('table#product-detail thead').append('<tr class="' + rowClass + '">\
					    <th>Customer Name</th>\
				        <th>PO #</th>\
					    <th></th>\
				        <th>Order #</th>\
				        <th>Request Date</th>\
				        <th>Order Date</th>\
				        <th>Total</th>\
				        <th>Forms</th>\
				        </tr>');					    
           for (var i = 0; i < result.length; i++) {
               if(result[i].DISTRICT.length === 1) {
                   var DISTRICT = '0' + result[i].DISTRICT;
               } else {
                   var DISTRICT = result[i].DISTRICT;
               }
               var total = formatCurrency(parseFloat(result[i].NETAR));
               var CUSTOM= result[i].CUSTOM; 
               if ((isFlagIdSet("OE",3) == "1") && (isFlagIdSet("OE",9) == "1")) {
            	   $('table#product-detail tbody').append('<tr id="'+DISTRICT+result[i].ORDERNO+'" class="'+rowClass+'">\
  						                                   <td>' + result[i].CUSTNAME + '</td>\
  					                                       <td>' + result[i].ORDERCMT + '</td>\
                                                           <td><a href="" onclick="quoteToOrder(\'' + DISTRICT + result[i].ORDERNO + '\')" class="no-decoration">Create Order</a></td>\
                                                           <td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'Q\', \'getOpenQuotes\')" >' + DISTRICT + result[i].ORDERNO + '</a></td>\
  						                                   <td>' + result[i].REQDATE + '</td>\
  						                                   <td>' + result[i].ORDERDATE + '</td>\
  						                                   <td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
  						                                   <td><a href="" onclick="showOrderForms(\'' + DISTRICT + result[i].ORDERNO + '\', \'' + CUSTOM + '\', \'Q\')"><i class="fa fa-file-text"></i></a></td>\
                       	                                   </tr>'); 
               } else {
                   $('table#product-detail tbody').append('<tr id="'+DISTRICT+result[i].ORDERNO+'" class="'+rowClass+'">\
                                                           <td>' + result[i].CUSTNAME + '</td>\
                                                           <td>' + result[i].ORDERCMT + '</td>\
                                                           <td></td>\
                                                           <td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'Q\', \'getOpenQuotes\')" >' + DISTRICT + result[i].ORDERNO + '</a></td>\
                                                           <td>' + result[i].REQDATE + '</td>\
                                                           <td>' + result[i].ORDERDATE + '</td>\
                                                           <td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
                                                           <td><a href="" onclick="showOrderForms(\'' + DISTRICT + result[i].ORDERNO + '\', \'' + CUSTOM + '\', \'Q\')"><i class="fa fa-file-text"></i></a></td>\
                                                           </tr>'); 
               }
               if (rowClass === 'odd') {
                    rowClass = 'even';
               } else {
                    rowClass = 'odd';
               }
           }
           $('#product-detail')
                .addClass('nowrap')
                .DataTable({
                    responsive: true,
                    columnDefs:[
                        { targets: [-1, -3], className: 'dt-body-right'}
                    ],
                    "order": [[ 0, "desc" ]]
           });
           loaderWidget(false);
        },
        error: function (xhr, status, error) {
            displayError("Error encountered while retrieving open orders. (E1)");
            loaderWidget(false);
        }
    });
}

function getOpenOrders() {
    loaderWidget(true, "Loading Open Orders...");
    $.ajax({url: contextPath + "/OrderEntryItemsXML",
        type: "POST",
        data: {"it": "O", "type": "json"},
        dataType: "json",
        success: function (result, status, xhr) {
           //console.log(result);
           var rowClass = 'odd';
           $('table#product-detail tbody').empty();
           $('table#product-detail thead').append('<tr class="' + rowClass + '">\
	                    <th>Customer Name</th>\
                        <th>PO #</th>\
                        <th>Order #</th>\
                        <th>Request Date</th>\
                        <th>Order Date</th>\
                        <th>Total</th>\
                   		<th>Forms</th>\
           				</tr>');        		   
           for (var i = 0; i < result.length; i++) {
               if(result[i].DISTRICT.length === 1) {
                   var DISTRICT = '0' + result[i].DISTRICT;
               } else {
                   var DISTRICT = result[i].DISTRICT;
               }
               var total = formatCurrency(parseFloat(result[i].NETAR));
               var CUSTOM= result[i].CUSTOM;
           	   // Credit Order but 0 value force to -0.00 for POPUP to appear in red too.
           	   if ((total === '0.00') && (result[i].ORDTYPE === 'C')) {
           	     total = '-0.00';  	
           	   }              
               // Credits
               if(result[i].ORDTYPE === 'C') {
            	   $('table#product-detail tbody').append('<tr class="' + rowClass + '">\
						<td>' + result[i].CUSTNAME + '</td>\
                        <td>' + result[i].ORDERCMT + '</td>\
                        <td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'O\', \'getOpenOrders\')" ><font color="red">' + DISTRICT + result[i].ORDERNO + '</a></td>\
                        <td>' + result[i].REQDATE + '</td>\
                        <td>' + result[i].ORDERDATE + '</td>\
                        <td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
                        <td><a href="" onclick="showOrderForms(\'' + DISTRICT + result[i].ORDERNO + '\', \'' + CUSTOM + '\', \'O\')"><i class="fa fa-file-text"></i></a></td>\
                        </tr>');
               } else {
                   $('table#product-detail tbody').append('<tr class="' + rowClass + '">\
   						<td>' + result[i].CUSTNAME + '</td>\
                        <td>' + result[i].ORDERCMT + '</td>\
                        <td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'O\', \'getOpenOrders\')" >' + DISTRICT + result[i].ORDERNO + '</a></td>\
                        <td>' + result[i].REQDATE + '</td>\
                        <td>' + result[i].ORDERDATE + '</td>\
                        <td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
                        <td><a href="" onclick="showOrderForms(\'' + DISTRICT + result[i].ORDERNO + '\', \'' + CUSTOM + '\', \'O\')"><i class="fa fa-file-text"></i></a></td>\
                        </tr>');           	   
               }
               if (rowClass === 'odd') {
                    rowClass = 'even';
               } else {
                    rowClass = 'odd';
               }
           }
           $('#product-detail')
                .addClass('nowrap')
                .DataTable({
                    responsive: true,
                    columnDefs:[
                        { targets: [-1, -3], className: 'dt-body-right'}
                    ],
                    "order": [[ 0, "desc" ]]
           });
           loaderWidget(false);
        },
        error: function (xhr, status, error) {
            displayError("Error encountered while retrieving open orders. (E1)");
            loaderWidget(false);
        }
    });
}
function getBlanketOrders() {
    loaderWidget(true, "Loading Blankets Orders...");
    $.ajax({url: contextPath + "/OrderEntryItemsXML",
        type: "POST",
        data: {"it": "B", "type": "json"},
        dataType: "json",
        success: function (result, status, xhr) {
           //console.log(result);
           var rowClass = 'odd';
           $('table#product-detail tbody').empty();
           $('table#product-detail thead').append('<tr class="' + rowClass + '">\
					   	<th>Customer Name</th>\
					   	<th>PO #</th>\
					   	<th>Order #</th>\
					   	<th>Request Date</th>\
					   	<th>Order Date</th>\
                   		<th>Total</th>\
                   		<th>Forms</th>\
                   		</tr>');         		   
           for (var i = 0; i < result.length; i++) {
               if(result[i].DISTRICT.length === 1) {
                   var DISTRICT = '0' + result[i].DISTRICT;
               } else {
                   var DISTRICT = result[i].DISTRICT;
               }
               var total = formatCurrency(parseFloat(result[i].NETAR));
               var CUSTOM= result[i].CUSTOM; 
               $('table#product-detail tbody').append('<tr class="' + rowClass + '">\
						<td>' + result[i].CUSTNAME + '</td>\
						<td>' + result[i].ORDERCMT + '</td>\
						<td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'B\', \'getBlanketOrders\')" >' + DISTRICT + result[i].ORDERNO + '</a></td>\
						<td>' + result[i].REQDATE + '</td>\
						<td>' + result[i].ORDERDATE + '</td>\
						<td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
						<td><a href="" onclick="showOrderForms(\'' + DISTRICT + result[i].ORDERNO + '\', \'' + CUSTOM + '\', \'B\')"><i class="fa fa-file-text"></i></a></td>\
						</tr>'); 
               if (rowClass === 'odd') {
                    rowClass = 'even';
               } else {
                    rowClass = 'odd';
               }
           }
           $('#product-detail')
                .addClass('nowrap')
                .DataTable({
                    responsive: true,
                    columnDefs:[
                        { targets: [-1, -3], className: 'dt-body-right'}
                    ],
                    "order": [[ 0, "desc" ]]
           });
           loaderWidget(false);
        },
        error: function (xhr, status, error) {
            displayError("Error encountered while retrieving open orders. (E1)");
            loaderWidget(false);
        }
    });
}

function getShippedOrders() {
    loaderWidget(true, "Loading Shipped Orders...");
    $.ajax({url: contextPath + "/OrderEntryItemsXML",
        type: "POST",
        data: {"it": "S", "type": "json"},
        dataType: "json",
        success: function (result, status, xhr) {
           //console.log(result);
           var rowClass = 'odd';
           $('table#product-detail tbody').empty();
           $('table#product-detail thead').append('<tr class="' + rowClass + '">\
				 	    <th>Customer Name</th>\
        		   		<th>PO #</th>\
					   	<th>Order #</th>\
					   	<th>Shipped Date</th>\
					   	<th>Order Date</th>\
					   	<th>Total</th>\
					   	<th>Forms</th>\
					   	</tr>');  
           for (var i = 0; i < result.length; i++) {
               if(result[i].DISTRICT.length === 1) {
                   var DISTRICT = '0' + result[i].DISTRICT;
               } else {
                   var DISTRICT = result[i].DISTRICT;
               }
               var total = formatCurrency(parseFloat(result[i].NETAR));
               var CUSTOM= result[i].CUSTOM;
               // Credits
               if(result[i].ORDTYPE === 'C') {
            	   $('table#product-detail tbody').append('<tr class="' + rowClass + '">\
						<td>' + result[i].CUSTNAME + '</td>\
                        <td>' + result[i].ORDERCMT + '</td>\
                        <td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'S\', \'getShippedOrders\')" ><font color="red">' + DISTRICT + result[i].ORDERNO + '</a></td>\
                        <td>' + result[i].REQDATE + '</td>\
                        <td>' + result[i].ORDERDATE + '</td>\
                        <td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
                        <td><a href="" onclick="showOrderForms(\'' + DISTRICT + result[i].ORDERNO + '\', \'' + CUSTOM + '\', \'S\')"><i class="fa fa-file-text"></i></a></td>\
                        </tr>');
               } else {
                   $('table#product-detail tbody').append('<tr class="' + rowClass + '">\
   						<td>' + result[i].CUSTNAME + '</td>\
                        <td>' + result[i].ORDERCMT + '</td>\
                        <td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'S\', \'getShippedOrders\')" >' + DISTRICT + result[i].ORDERNO + '</a></td>\
                        <td>' + result[i].REQDATE + '</td>\
                        <td>' + result[i].ORDERDATE + '</td>\
                        <td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
                        <td><a href="" onclick="showOrderForms(\'' + DISTRICT + result[i].ORDERNO + '\', \'' + CUSTOM + '\', \'S\')"><i class="fa fa-file-text"></i></a></td>\
                        </tr>');           	   
               }              
               if (rowClass === 'odd') {
                    rowClass = 'even';
               } else {
                    rowClass = 'odd';
               }
           }
           $('#product-detail')
                .addClass('nowrap')
                .DataTable({
                    responsive: true,
                    columnDefs:[
                        { targets: [-1, -3], className: 'dt-body-right'}
                    ],
                    "order": [[ 0, "desc" ]]
           });
           loaderWidget(false);
        },
        error: function (xhr, status, error) {
            displayError("Error encountered while retrieving shipped orders. (E1)");
            loaderWidget(false);
        }
    });
}

function getOrderInfo(orderNum, type, opt) {
    loaderWidget(true, 'Loading Items...');
    if (opt === 'tags') {
        $('h3#title').text('Item Tag Information');
    } else {
        $('h3#title').text('Item Information');
    }

    if (type === 'S') {
        var btnTags = '<tr><th><button class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini" onclick="" tabindex="7">Show Tags</button></th><td></td>';
    } else {
        var btnTags = '';
    }

    $('div#order-items').empty();
    $('div#order span#total').text('$' + $('td[orderno="' + orderNum + '"]').text());
    $('a#loadOrder').attr('onclick', "loadSavedOrder('" + orderNum + "', '" + type + "')");

    var def = $.Deferred();
    def.done(function(n) {
        $('[data-role=collapsible-set]').collapsibleset().trigger('create');
        $('[data-role=collapsible]').collapsible().trigger('create');
        openPopup('order');
        loaderWidget(false);
    });

    $.ajax({url: contextPath + "/OrderEntryItemsXML",
        type: "POST",
        data: {"it": type, "type": "json", "ir": "Q", "sv": orderNum},
        dataType: "json",
        success: function (result, status, xhr) {
           for (var i = 0; i < result.length; i++) {
                if (i === 0) {
                    var dataCollapsed = "false";
                } else {
                    var dataCollapsed = "true";
                }
                $('div#order-items').append('<div data-role="collapsible" data-inset="false" data-collapsed="' + dataCollapsed + '">\
                                             <h4><span>' + result[i].DESC + '</span></h4>\
                                             <table id="item-information"></table>\
                                             </div>');

                if (opt === 'tags') {
                    $('table#item-information').css('width', '100%');
                    $.ajax({url: contextPath + "/OrderEntryItemsXML",
                        type: "POST",
                        data: {"tag": "Y", "type": "json", "dn": result[i].DISTRICT, "on": orderNum, "ln": result[i].LINENO, "ot": result[i].ORDTYPE},
                        dataType: "json",
                        success: function (result2, status2, xhr2) {
                            $('div#order-items table').append('<tr><th>Tag #</th><th>Heat #</th><th>Mill Coil #</th><th>PO #</th></tr>');
                            for (var x = 0; x < result2.length; x++) {
                                $('div#order-items table').append('<tr>\
                                                                   <td>' + result2[x].TAGNO + '</td>\
                                                                   <td>' + result2[x].TAGHEATNO + '</td>\
                                                                   <td>' + result2[x].MILLCOILNO + '</td>\
                                                                   <td>' + result2[x].PONUM + '</td>\
                                                                   </tr>');
                            }
                            if (i === result.length) {
                                $('a#loadOrder').hide();
                                $('div#popBtnWrap').css('margin-left', '-20px');
                                def.resolve();
                            }
                        }
                    });
                } else {
                    $('div#order-items table').append('<tr><th>Item #:</th><td id="itemNo">' + result[i].ITEMNO + '</td></tr>\
                                                       <tr><th>Part #:</th><td>' + result[i].CUSTITEM + '</td></tr>\
                                                       <tr><th>Qty:</th><td id="qty">' + result[i].QTY + '</td></tr>\
                                                       <tr><th>UOM:</th><td id="uom">' + result[i].UOM + '</td></tr>\
                                                       <tr><th>Width:</th><td>' + result[i].WIDTH + '</td></tr>\
                                                       <tr><th>Length:</th><td>' + result[i].LENGTH + '</td></tr>\
                                                       <tr><th>Price:</th><td>' + result[i].PRICE + '</td></tr>\
                                                       <tr><th>Prc UOM:</th><td>' + result[i].PRCUOM + '</td></tr>\
                                                       <tr><th>Ext Price:</th><td>' + result[i].EXTPRC + '</td></tr>\
                                                       <tr><th>Status:</th><td>' + result[i].ITEMSTATUS + '</td></tr>\
                                                       ' + btnTags );
                    if (i === result.length - 1) {
                        $('a#loadOrder').show();
                        if (opt === 'saved'){
                            $('div#popBtnWrap').css('margin-left', '-20px');
                        }
                        def.resolve();
                    }
                }
           }
        },
        error: function (xhr, status, error) {
            displayError("Error encountered while retrieving order information. (E1)");
            //alert("BOOM");
            loaderWidget(false);
        }
    });
}

function replacer(key, value) {
	return value.replace('/','');
}

function getOrderInfo2(orderNum8, type, opt) {
	var orderNum = orderNum8.substr(2)
    loaderWidget(true, 'Loading Items...');
    if (opt === 'loadSaveOrder') {
    } else if (opt === 'tags') {
        $('h3#title').text('Item Tag Information');
    } else {
        $('h3#title').text('Item Information');
    }

    // Show Tags if "INVOICED" only
    //if (type === 'S') {
        var btnTags = '<tr><th colspan="2">\
        	<button id="item-tags" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-mini ui-icon-carat-d ui-btn-icon-left"\
        	onclick="displayTable(\'item-tags\');\
        	" tabindex="7">Show Tags</button>\
        	</th><td></td>';
    //} else {
    //    var btnTags = '';
    //}

    // Order/Invoice/Quotes **************    
   	$('div#order-items').empty();
   	$('h4#total').show();
   	$('div#order span#total').text($('td[orderno="' + orderNum + '"]:first').text());
   	if ($('div#order span#total').text().search('-') === 1) {
   		$('div#order span#total').removeClass('positive');
   		$('div#order span#total').addClass('negative');
   	} else {
   		$('div#order span#total').removeClass('negative');
   		$('div#order span#total').addClass('positive');
   	}  	
   	$('a#loadOrder').attr('onclick', "loadSavedOrder('" + orderNum + "', '" + type + "')");
    if ((isFlagIdSet("OE",3) == "1") && (isFlagIdSet("OE",9) == "1")) {
    	$('a#quoteToOrder').attr('onclick', "quoteToOrder('" + orderNum8 + "')");
    } else {
    	$('a#quoteToOrder').hide();
    }
    var def = $.Deferred();
    def.done(function(n) {
        $('[data-role=collapsible-set]').collapsibleset().trigger('create');
        $('[data-role=collapsible]').collapsible().trigger('create');
        if (myScrollInit) {
            myScroll.refresh();
        } else {
            myScroll = new IScroll('div#order #wrapper', { scrollX: true, scrollbars: 'custom', mouseWheel: true, click: true });
            myScrollInit = true;
        }
        openPopup('order');
        loaderWidget(false);
    });

 // Blanket Orders work just like Orders except type is "B" in GETORDQUOTITEMS3
    if ((opt === 'getBlanketOrders') && (type === 'O')) {
    	type = 'B';
    }
    
    //Get Order/Invoice/Quotes *****(GETORDQUOTITEMS3)***************
    $.ajax({url: contextPath + "/OrderEntryItemsXML",
        type: "POST",
        data: {"it": type, "type": "json", "ir": "Q", "sv": orderNum},
        dataType: "json",
        success: function (result, status, xhr) {
            var i = 0;
            displayOrderInfo();
            function displayOrderInfo() {
            if (i === 0) {
              var dataCollapsed = "false";
            } else {
              var dataCollapsed = "true";
            }
            // Hide Tags
            $('div#order-items').append('<div data-role="collapsible" data-inset="false" data-collapsed="' + dataCollapsed + '">\
                    <h4><span>' + result[i].DESC + '</span></h4>\
                    <table id="item-information" lineno="' + i + '"></table>\
                    <table id="item-tags"        lineno="' + i + '" class="hide"></table>\
                    </div>');
            
            //Order Line Items ******************
            $('div#order-items table#item-information[lineno="' + i + '"]').append(
            '<tr><th>Item #:   </th><td id="itemNo">' + result[i].ITEMNO     + '</td></tr>\
             <tr><th>Part #:   </th><td>' 			  + result[i].CUSTITEM   + '</td></tr>\
             <tr><th>Qty:      </th><td id="qty">'    + result[i].QTY        + '</td></tr>\
             <tr><th>UOM:      </th><td id="uom">'    + result[i].UOM        + '</td></tr>\
             <tr><th>Width:    </th><td>'             + result[i].WIDTH      + '</td></tr>\
             <tr><th>Length:   </th><td>'             + result[i].LENGTH     + '</td></tr>\
             <tr><th>Price:    </th><td>'             + result[i].PRICE      + '</td></tr>\
             <tr><th>Prc UOM:  </th><td>'             + result[i].PRCUOM     + '</td></tr>\
             <tr><th>Ext Price:</th><td>'             + result[i].EXTPRC     + '</td></tr>\
             <tr><th>Status:   </th><td>'             + result[i].ITEMSTATUS + '</td></tr>\
            ' + btnTags );
                    
            //Order Line Item Tags ******************
            $.ajax({url: contextPath + "/OrderEntryItemsXML",
               type: "POST",
               data: {"tag": "Y", "type": "json", "dn": result[i].DISTRICT, "on": orderNum, "ln": result[i].LINENO, "ot": result[i].ORDTYPE},
               dataType: "json",
               success: function (result2, status2, xhr2) {
               if (result2.length > 0) {
            	  var wDISTRICT = result[i].DISTRICT 
            	  var wORDERNO  = result[i].DISTRICT + orderNum;
            	  var wITEMNO   = result[i].ITEMNO.trim();
            	  var wCPO      = encodeURIComponent(result[i].ORDERCMT.trim()).replace(/%20/g,'+');
            	  var wCUSTNAME = encodeURIComponent(result[i].CUSTNAME.trim()).replace(/%20/g,'+');
            	  var wPARTNO   = encodeURIComponent(result[i].CUSTITEM.trim()).replace(/%20/g,'+');
            	  $('div#order-items table#item-tags[lineno="' + i + '"]').append(
            	    '<tr><th>Tag #</th><th>Heat #</th><th>Mill Coil #</th><th>PO #</th></tr>');
                 for (var x = 0; x < result2.length; x++) {
               	  var wTAGNO    = result2[x].TAGNO.trim(); 	 
                  var wHEAT     = encodeURIComponent(result2[x].TAGHEATNO.trim()).replace(/%20/g,'+');	
                  var wPONUMB   = result2[x].PONUM;
                  var wCERTFLAG = result2[x].CERTFLAG;
                  var wHEATLNK= '';
                  if (wCERTFLAG == '1') {                	   
                     wHEATLNK = '<a href=/'+result[i].CUSTOM+'/pdfdoc?type=cert&val1=' + wTAGNO + '&val2=' + wITEMNO + '&val3=' + wDISTRICT + ' target="_blanks">' + wHEAT + '</a>'  
                  } else if (wCERTFLAG == 'A') {
                     wHEATLNK = '<a href=https://docstar.admiralmetals.com/pdfapi/api/values?HEAT=' + wHEAT + '&PONUMB=' + wPONUMB + '&ITEM=' + wITEMNO + '&CUST=' + wCUSTNAME + '&PO=' + wCPO + '&ORDER=' + wORDERNO + '&PART=' + wPARTNO + ' target="_blanks">' + wHEAT + '</a>'
                  } else {
                	 wHEATLNK = wHEAT;
                  }
                  $('div#order-items table#item-tags[lineno="' + i + '"]').append(
                	'<tr>\
                     <td>' + wTAGNO                + '</td>\
                     <td>' + wHEATLNK              + '</td>\
                     <td>' + result2[x].MILLCOILNO + '</td>\
                     <td>' + wPONUMB               + '</td>\
                     </tr>');
                 }
               } else {
                 $('div#order-items table#item-tags[lineno="' + i + '"]').append(
                   '<tr><th class="note">This item has no tags.</th></tr>');
               }
               
               // Continue
               i++;
               if (i < result.length) {
                 displayOrderInfo();
               } else if(opt === 'loadSaveOrder') {
            	 loadSavedOrder(orderNum8, type);
               } else {
                 $('a#loadOrder').show();
                 if (opt === 'saved'){
                   $('div#popBtnWrap').css('margin-left', '-20px');
                 } 
                   def.resolve();
                 }
               }
             });
           }
        },
        error: function (xhr, status, error) {
            displayError("Error encountered while retrieving order information. (E1)");
            //alert("BOOM");
            loaderWidget(false);
        }
    });
}

function getOrderForms(orderNum, custom, type) {
    var metalNet = 'Metalweb';
	if (custom=="Frisa") {metalNet=custom;}
    loaderWidget(true, 'Loading Items...');

    $('h3#title').text('Order Forms');
    $('div#order-items').empty();
    //$('div#order span#total').text('$' + $('td[orderno="' + orderNum + '"]').text());
    $('h4#total').hide();

    $('div#order-items').append('<table id="order-forms"></table>');

    // Quotes view (forms flags are plus 1 so 1st postion-Invoices in maintenance is flag 2)
    if (type == 'Q') {
        if (isFlagIdSet("FORMS", 3)) { $('table#order-forms').append('<tr><td class="icon col1"><a href="/'+metalNet+'/pdfdoc?type=qtf&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Quotes</div></a></td></tr>'); }    	
    // Orders view (forms flags plus 1 so 1st position-invoices in maintenance is flag 2)
    } else if (type == 'O') {
    	if (isFlagIdSet("FORMS", 4)) { $('table#order-forms').append('<tr><td class="icon col3"><a href="/'+metalNet+'/pdfdoc?type=ack&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Acknowledgement</div></a></td></tr>'); }
    	if (isFlagIdSet("FORMS", 7)) { $('table#order-forms').append('<tr><td class="icon col1"><a href="/'+metalNet+'/pdfdoc?type=wor&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Sales Order</div></a></td></tr>'); } 
    // Shipped Orders view (forms flags plus 1 so 1st position-invoices in maintenance is flag 2) 
    } else {
    	if (isFlagIdSet("FORMS", 7)) { $('table#order-forms').append('<tr><td class="icon col3"><a href="/'+metalNet+'/pdfdoc?type=wor&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Sales Order</div></a></td></tr>');}	
    	if (isFlagIdSet("FORMS", 2)) { $('table#order-forms').append('<tr><td class="icon col1"><a href="/'+metalNet+'/pdfdoc?type=inv&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Invoice</div></a></td></tr>'); }
    	if (isFlagIdSet("FORMS", 5)) { $('table#order-forms').append('<tr><td class="icon col2"><a href="/'+metalNet+'/pdfdoc?type=blso&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Bill of Lading</div></a></td></tr>'); }
    	if (isFlagIdSet("FORMS", 4)) { $('table#order-forms').append('<tr><td class="icon col3"><a href="/'+metalNet+'/pdfdoc?type=ack&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Acknowledgement</div></a></td></tr>'); }
        if (custom == 'Admiral') {
      	  if (isFlagIdSet("FORMS", 8)) { $('table#order-forms').append('<tr><td class="icon col3"><a href="http://ecom.admiralmetals.com/MetalwebMobile/forms/delrec.php?t=OE&o=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Packing List</div></a></td></tr>'); }
        }else{
    	  if (isFlagIdSet("FORMS", 8)) { $('table#order-forms').append('<tr><td class="icon col3"><a href="/'+custom+'/pdfdoc?type=pack&val1=' + orderNum + '" target="_blank"><div><i class="fa fa-file-text-o"></i>Packing List</div></a></td></tr>'); }
        }  
    }
    
    $('a#loadOrder').hide();
    $('div#popBtnWrap').css('margin-left', '-20px');
    openPopup('order');
    loaderWidget(false);
}

function showOrderItems(orderNum, type, opt) {
    $('div#order h4#order span').text(orderNum);
    $('div#order').css('height', height - 100);
    $('div#order').css('max-height', height - 100);
    getOrderInfo2(orderNum, type, opt);
}

function showOrderForms(orderNum, custom, type) {
    $('div#order h4#order span').text(orderNum);
    $('div#order').css('height', height - 100);
    $('div#order').css('max-height', height - 100);
    //myScroll = new IScroll('div#order #wrapper', { scrollX: true, scrollbars: 'custom', mouseWheel: true, click: true });
    getOrderForms(orderNum, custom, type);
}

function displayTable(id) {
    if ($('table#' + id).hasClass('hide')) {
        $('table#' + id).removeClass('hide');
        if (id === 'item-tags') {
            $('button#' + id).text('Hide Tags');
            $('button#' + id).removeClass('ui-icon-carat-d');
            $('button#' + id).addClass('ui-icon-carat-u');
        }
    } else {
        $('table#' + id).addClass('hide');
        if (id === 'item-tags') {
            $('button#' + id).text('Show Tags');
            $('button#' + id).removeClass('ui-icon-carat-u');
            $('button#' + id).addClass('ui-icon-carat-d');
        }
    }
    myScroll.refresh();
}

function getSavedCarts() {
    loaderWidget(true, "Loading Saved Carts...");
    $.ajax({url: contextPath + "/OrderEntryItemsXML",
        type: "POST",
        data: {"it": "C", "type": "json"},
        dataType: "json",
        success: function (result, status, xhr) {
           //console.log(result);
           var rowClass = 'odd';
           $('table#product-detail tbody').empty();
           $('table#product-detail thead').append('<tr class="' + rowClass + '">\
                                                   <th>Date</th>\
                                                   <th>Cart #</th>\
                                                   <th>Cart Name</th>\
                                                   <th>Total</th>\
                                                   <th></th>\
                                                   <th></th>\
                                                   </tr>');
           for (var i = 0; i < result.length; i++) {
               if(result[i].DISTRICT.length === 1) {
                   var DISTRICT = '0' + result[i].DISTRICT;
               } else {
                   var DISTRICT = result[i].DISTRICT;
               }
               var total = formatCurrency(parseFloat(result[i].NETAR));
               $('table#product-detail tbody').append('<tr class="' + rowClass + '" cid="' + result[i].ORDERNO + '">\
                                                      <td>' + result[i].ORDERDATE + '</td>\
                                                      <td><a href="" onclick="showOrderItems(\'' + DISTRICT + result[i].ORDERNO + '\', \'C\', \'saved\')">' + DISTRICT + result[i].ORDERNO + '</a></td>\
                                                      <td>' + result[i].CARTNAME + '</td>\\n\
                                                      <td orderno="' + result[i].ORDERNO + '">$' + total + '</td>\
                                                      <td><a href="" onclick="loadSavedCart(\'' + result[i].ORDERNO + '\', \'C\')" class="no-decoration"><i class="fa fa-shopping-cart"></i> Load</a></td>\
                                                      <td><a href="" onclick="removeSavedCart(\'' + result[i].ORDERNO + '\')" class="no-decoration"><i class="fa fa-times"></i> Remove</a></td>\
                                                      </tr>');

               if (rowClass === 'odd') {
                    rowClass = 'even';
               } else {
                    rowClass = 'odd';
               }
           }
           table = $('#product-detail')
                .addClass('nowrap')
                .DataTable({
                    responsive: true,
                    columnDefs:[
                        { targets: [-1, -3], className: 'dt-body-right'}
                    ],
                    "order": [[ 0, "desc" ]]
           });
           loaderWidget(false);
        },
        error: function (xhr, status, error) {
            displayError("Error encountered while retrieving saved carts. (E1)");
            loaderWidget(false);
        }
    });
}

function removeSavedCart(CartID) {
    loaderWidget(true, 'Removing Cart...');
    $.ajax({url: contextPath + "/OrderEntryCartXML?a=x&cid="+CartID,
        dataType: 'text',
        success: function (result, status, xhr) {
            table.row('tr[cid="' + CartID + '"]').remove().draw();
            $('#message h3').text("Cart has been removed.");
            loaderWidget(false);
            openPopup('message');
        },
        error: function (xhr, status, error) {
            alert(error);
            loaderWidget(false);
        }
    });
} 

function quoteToOrder(orderNum) { 
	  //showOrderItems(orderNum,'Q','loadSavedOrder');
	  getOrderInfo2(orderNum,'Q','loadSaveOrder');
}

function cloneRow(rowClass, recItemNo, recUnits, recWidth, recLength, recMsg, desc1, recQty, extPrice, recDesc, mLineNbr1, recCustItem, recDist) { 
	/*alert(mLineNbr1);
	var count = $('#cart-detail tr').length;
	var j = count-1;
	$('table#cart-detail tbody').append('<tr class="' + rowClass + '" row="' + j + '" item="' + recItemNo + '" uom="' + recUnits + '" wid="' + recWidth + '" len="' + recLength + '" comment="' + recMsg + '">');
    $('table#cart-detail tbody').append('<td>' + desc1 + '</td>\\n');
    $('table#cart-detail tbody').append('<td>' + recUnits + '</td>');
    $('table#cart-detail tbody').append('<td id="qty"><input type="number" name="qty" id="qty" row="'
    		+ j + '" item="' + recItemNo + '" value="' + recQty + '" /></td>');

    // Display Price
    if(isFlagIdSet("OE",9)) {
      $('table#cart-detail tbody').append('<td>$' + extPrice + '</td>');
    } else {
      $('table#cart-detail tbody').append('<td>NA</td>');  
    }
    $('table#cart-detail tbody').append('<td><a href="" onclick="openPopup(\'itemComment\', ' + j + ', \''  + recDesc.replace(/("|')/g,"") + '\');"><img id="' + recItemNo + '" src="images/comments.png" height="25" style="vertical-align:middle;"/></a></td>');
    
    // Ability to add USEDLINES
    if(isFlagIdSet("OE",14)) {
      var wDesc = recDesc.replace(/("|')/g,"") + "_" + recQty + "_" + recUnits + "_" + mLineNbr1 +"_" + recCustItem;
      $('table#cart-detail tbody').append('<td><a href="" onclick="openPopup(\'usedItemTags\',\'' + j + '\',\'' + wDesc + '\',\'' +j + '\',\'' + recItemNo + '\',\'' + recDist + '\');"><img id="' + recItemNo + '" src="images/upload.png" height="25" style="vertical-align:middle;"/></a></td>');
    } else {
      $('table#cart-detail tbody').append('<td><a href="" onclick=""><img id="' + recItemNo + '" src="images/upload.png" height="25" style="vertical-align:middle; opacity:.3; cursor:default;"/></a></td>');                        	
    }

    $('table#cart-detail tbody').append('<td style="display:table-cell;"><a href="" onclick="openPopup(\'itemDelete\',' + j + ',\'' + recDesc.replace(/("|')/g, "") + '\');"><img id="' + recItemNo + '" src="images/remove2.png" height="25" style="vertical-align:middle;"/></a></td>');
    $('table#cart-detail tbody').append('<td style="display:table-cell;"><a href="" onclick="cloneRow(\''+rowClass+'\',\''+ recItemNo+'\',\''+ recUnits+'\',\''+ recWidth+'\',\''+ recLength+'\',\''+ recMsg+'\',\''+ desc1+'\',\''+ recQty+'\',\''+ extPrice+'\',\''+ recDesc+'\',\''+ mLineNbr1+'\',\''+ recCustItem+'\',\''+ recDist+'\');"><img id="' + recItemNo + '" src="images/replicate.png" height="25" style="vertical-align:middle;"/></a></td>');
    $('table#cart-detail tbody').append('</tr>');*/
    AddToCart(recItemNo, recQty, recUnits, recDesc, recCustItem, '','', false,recWidth,recLength);	
}

function specifySizeFunction(itemno1,len1,wid1) {
            itemno1 = String(itemno1).padStart(5, '0');
            if(wid1 !== 0) {
                document.getElementById('ssWidDiv'+itemno1).style.display = "flex";
                document.getElementById('ssWidDivSelect'+itemno1).style.display = "flex";
            }
            if(len1 !== 0) {
                document.getElementById('ssLenDiv'+itemno1).style.display = "flex";
                document.getElementById('ssLenDivSelect'+itemno1).style.display = "flex";
            }

            document.getElementById('SpecifySizeParentDiv'+itemno1).style.display = "flex";


}

function updateSizeCall(itemno1,qty,uom) {
    itemno1 = String(itemno1).padStart(5, '0');
    //alert('test spec size'+ itemno1);
    var items = [];
    var leng = document.getElementById('ssLen'+itemno1).value;
    var widt = document.getElementById('ssWid'+itemno1).value;
    
    var u1 = document.getElementById('ssLenUOM'+itemno1).value;
    if(u1 !== 'inch') leng = leng*12;
    var u2 = document.getElementById('ssWidUOM'+itemno1).value;
    if(u2 !== 'inch') widt = widt*12;
    
    items[0] = {ITEMNO:itemno1,CUSTITEM:'',LENGTH:leng,WIDTH:widt};
    itemLookup(items, uom, qty, '', true);
    
    console.log("updating size");
}

function sizeInfoDisplayFun(itemno1,wid1,len1) {
    itemno1 = String(itemno1).padStart(5, '0');
    var u1 = document.getElementById('ssLenUOM'+itemno1).value;
    var u2 = document.getElementById('ssWidUOM'+itemno1).value;
    var leng = document.getElementById('ssLen'+itemno1).value;
   //alert("Hello"+ u1+" " +u2+" "+leng+" "+wid1);
   document.getElementById('sizeInfo'+itemno1).style.display='flex';
   
    if(u1 !== 'inch')  var numQuotes1="'";
    else var numQuotes1='"';
    
    if(u2 !== 'inch')  var numQuotes2="'";
    else var numQuotes2='"';
    
    if(wid1 !== 0){
        var widt = document.getElementById('ssWid'+itemno1).value; 
        document.getElementById('sizeInfo'+itemno1).innerHTML="Cut to size:"+leng + numQuotes1+' X ' +widt+numQuotes2;
    }
    else document.getElementById('sizeInfo'+itemno1).innerHTML="Cut to size:"+leng + numQuotes1;   
}

function showInvAllDist(i){
    
    for(var t =0; t<i;t++){
        var rowName = "notfavdist"+t;
        $("#"+rowName).fadeIn();
        //if(!!document.getElementById(rowName) === true) document.getElementById(rowName).style.display = 'block';
    }
    
}

function showInvFavDist(i){
    
    for(var t =0; t<i;t++){
        var rowName = "notfavdist"+t;
        $("#"+rowName).hide();
        //if(!!document.getElementById(rowName) === true) document.getElementById(rowName).style.display='none';// = 'none';
    }
}