
// // *************************************************************
//           *************** EVENTS ******************
// *************************************************************

// "DAILYOFR" selection
$(document).on('change', 'select#daily', function (e) {
    dailyOfrW = this.options[e.target.selectedIndex].value;
    dailyOfrA= dailyOfrW.split("_");
    dailyOfr = dailyOfrA[1];
    partInfo = "";
    qty      = 1;
    msg      = "";
    class1   = ""; 
    grade    = "";   
    temper   = ""; 
    shape    = "";  
    thick    = "";
    size1    = ""; 
    size2    = "";
    size3    = "";
    size4    = "";
    uom      = "EA "; 
    uomDft   = "EA ";

    // login in as guest or account
    if (!loggedIn) {
      //$('#login').popup('open');
      $('#login').modal('show');
      this.options[0].selected = true;
      $('#daily').selectmenu();
      $('#daily').selectmenu('refresh', true); 
    } else {
      // Redisplay default
      this.options[0].selected = true;
      $('#daily').selectmenu();
      $('#daily').selectmenu('refresh', true);  
      productSelector(partInfo, dailyOfr, qty, msg);
    }
});

// "PARTNBR" selection
$(document).on('change', 'select#part', function (e) {
    partInfo = this.options[e.target.selectedIndex].value;
    dailyOfr = "";
    partA    = partInfo.split("_");
    qty    = 1;
    msg    = "";
    class1 = ""; 
    grade  = "";   
    temper = ""; 
    shape  = "";  
    thick  = "";
    size1  = ""; 
    size2  = "";
    size3  = "";
    size4  = "";
    uom    = partA[1];  
    uomDft = partA[1];

    // Redisplay default
    this.options[0].selected = true;
    $('#part').selectmenu();
    $('#part').selectmenu('refresh', true);
    // Redisplay default
    //loadPn();
    
    // functions.js/productSelector(qty,msg)
    productSelector(partInfo,dailyOfr,qty, msg);
});
 
// "Class" selection
$(document).on('change', 'select#cls', function (e) {
    var clsSelected = this.options[e.target.selectedIndex].value;
                
    // Reset content and labels
    resetSelect('grade',  true);
    enableLabel('grade',  false); 
    clearBtnFilters('grade');
    resetSelect('sspec',  true);
    enableLabel('spec',   false);
    clearBtnFilters('sspec', true);
    resetSelect('temper', true);
    enableLabel('temper', false); 
    clearBtnFilters('temper', true);   
    resetSelect('shape',  true);
    enableLabel('shape',  false);  
    clearBtnFilters('shape',true);   
    resetSelect('thick',  true);
    enableLabel('thick',  false);  
    clearBtnFilters('thick', true);  
    resetSelect('size',   true);
    enableLabel('size',   false); 
    clearBtnFilters('size',true);  
    resetSelect('uom',    true);             
    enableLabel('uom',    false);
    clearBtnFilters('uom',true);  

    partInfo = "";    
    dailyOfr = "";
    if (clsSelected !== 'none') {
      // Next is Grade
      if ((isFlagIdSet("PRDSEL",3)) || 
    	  (isFlagIdSet("PRDSEL",4)) ||
    	  (isFlagIdSet("PRDSEL",6))) {
        loadGrade(clsSelected); 	  
        enableSelect('grade');
        enableLabel('grade', true);
       // Next is Shape
      }else if (isFlagIdSet("PRDSEL",5)) {
    	loadShape(clsSelected);
        enableSelect('shape');
        enableLabel('shape', true);
      }
    }
});
 
// "Grade" selection
$(document).on('change', 'select#grade', function (e) {
    
    gradeSelected = this.options[e.target.selectedIndex].value;
    resetSelect('sspec',  true);
    enableLabel('spec',   false);
    clearBtnFilters('sspec', true);

    if (gradeSelected != 'none') {
      // Next is Temper
      if (isFlagIdSet("PRDSEL",3) ||
    	  isFlagIdSet("PRDSEL",6)) {
          resetSelect('temper', true);
          enableLabel('temper', false);
          clearBtnFilters('temper');   
          resetSelect('shape',  true);
          enableLabel('shape',  false);	
          clearBtnFilters('shape', true);
          resetSelect('thick',  true);
          enableLabel('thick',  false);
          clearBtnFilters('thick', true);
          resetSelect('uom',    true);
          enableLabel('uom',    false);
          clearBtnFilters('uom',true); 
          loadGradeSpec(gradeSelected);
          loadTemper(gradeSelected);	       
          enableSelect('temper');
          enableLabel('temper', true);
       // Next is Shape
      } else if (isFlagIdSet("PRDSEL",4)) {
          resetSelect('shape',  true);
          enableLabel('shape',  false);	
          clearBtnFilters('shape');
          resetSelect('thick',  true);
          enableLabel('thick',  false);
          clearBtnFilters('thick', true);
          resetSelect('size',  true);
          enableLabel('size',  false);
          clearBtnFilters('size',true);
          resetSelect('uom',    true);
          enableLabel('uom',    false);
          clearBtnFilters('uom',true);  
          loadShape(gradeSelected);	       
          enableSelect('shape');
          enableLabel('shape', true);    	
       // Next is Size
      } else if (isFlagIdSet("PRDSEL",5)) {
          // resetSelect('temper', true);
          // enableLabel('temper', false);
          // clearBtnFilters('temper');  
          // resetSelect('thick',  true);
          // enableLabel('thick',  false);
          // clearBtnFilters('thick', true);
          resetSelect('uom',    true);
          enableLabel('uom',    false);
          clearBtnFilters('uom',true); 
          // loadGradeSpec(gradeSelected);
          // loadTemper(gradeSelected);	       
         // enableSelect('temper');
         // enableLabel('temper', true);
      }
    // none Selected
    } else {
      // Reset Temper
      if (isFlagIdSet("PRDSEL",3) ||
    	  isFlagIdSet("PRDSEL",6)) {
          resetSelect('temper', true);
          enableLabel('temper', false);
          clearBtnFilters('temper');   
          resetSelect('thick',  true);
          enableLabel('thick',  false);
          clearBtnFilters('thick', true);
      // Reset Shape
      } else if (isFlagIdSet("PRDSEL",4)) {
          resetSelect('shape',  true);
          enableLabel('shape',  false);	  
          clearBtnFilters('shape');  	
      // Reset Size
      } else if (isFlagIdSet("PRDSEL",5)) {
          resetSelect('size',  true);
          enableLabel('size',  false);  
          clearBtnFilters('size',true); 
      }	
    }
});

//"Temper" selection
$(document).on('change', 'select#temper', function (e) {	
 var temperSelected = this.options[e.target.selectedIndex].value;
 // var selections = temperSelected.split("_");
 // temperSelected = selections[2];
 
 // Reset content and labels
 resetSelect('thick', true);
 enableLabel('thick', false); 
 clearBtnFilters('thick', true);   
 resetSelect('size',  true);
 enableLabel('size',  false);
 clearBtnFilters('size', true);   
 resetSelect('uom',   true);
 enableLabel('uom',   false);
 clearBtnFilters('uom', true);
 
 if (temperSelected !== 'none') {
   if (isFlagIdSet("PRDSEL",3)) {
     resetSelect('shape', true);
     enableLabel('shape', false);
     clearBtnFilters('shape');  
     loadShape(temperSelected);
     enableSelect('shape');
     enableLabel('shape', true);
   }  
   else {
     loadThick(temperSelected); 
     enableSelect('thick');
     enableLabel('thick', true);
   }
 }
});

// "Shape" selection
$(document).on('change', 'select#shape', function (e) {
    shapeSelected = this.options[e.target.selectedIndex].value;
    
    // Reset Next Options
      if (isFlagIdSet("PRDSEL",3) ||
    	  isFlagIdSet("PRDSEL",6)) {  
          resetSelect('thick', true);
          enableLabel('thick', false);
          clearBtnFilters('thick');
          resetSelect('size',  true);
          enableLabel('size',  false);
          clearBtnFilters('size',true); 
          resetSelect('uom',   true);
          enableLabel('uom',   false);
          clearBtnFilters('uom');
      } else if (isFlagIdSet("PRDSEL",4)) {
          resetSelect('thick', true);
          enableLabel('thick', false);
          clearBtnFilters('thick');
          resetSelect('size',  true);
          enableLabel('size',  false);	
          clearBtnFilters('size',true); 
          resetSelect('uom',   true);
          enableLabel('uom',   false);
          clearBtnFilters('uom');
      } else if (isFlagIdSet("PRDSEL",5)) {
    	  resetSelect('grade',  true); 
          enableLabel('grade',  false);   //Benjamin needed this 05/11/21
          clearBtnFilters('grade'); 
          resetSelect('temper',  true);
          enableLabel('temper',  false);	
          clearBtnFilters('temper',true); 
          resetSelect('thick',  true);
          enableLabel('thick',  false);	
          clearBtnFilters('thick',true); 
          resetSelect('size',  true);
          enableLabel('size',  false);	
          clearBtnFilters('size',true); 
          resetSelect('uom',   true);
          enableLabel('uom',   false);
          clearBtnFilters('uom');
      }
      
    // Next is Thick
    if (shapeSelected != 'none') {
      if (isFlagIdSet("PRDSEL",3) ||
    	  isFlagIdSet("PRDSEL",6)) { 
          loadThick(shapeSelected);
	      uomS = UOM[shapeSelected.split("_")[3]][1];
	      loadUOM(uomS);
          enableSelect('thick');
          enableLabel('thick', true);
       // Next is Thick
      } else if (isFlagIdSet("PRDSEL",4)) {
          loadThick(shapeSelected);
	      uomS = UOM[shapeSelected.split("_")[2]][1];
	      loadUOM(uomS);
          enableSelect('thick');
          enableLabel('thick', true);    	
       // Next is Size
      } else if (isFlagIdSet("PRDSEL",5)) {
          loadGrade(shapeSelected);
          loadTemper(shapeSelected);
          loadThick(shapeSelected);
          enableSelect('grade');
          enableLabel('grade', true)
          enableSelect('temper');
          enableLabel('temper', true)
          enableSelect('thick');
          enableLabel('thick', true)
      }
      enableSelect('uom');
      enableLabel('uom', true);
    }
});
            
// Thickness selection
$(document).on('change', 'select#thick', function (e) {
    thickSelected = this.options[e.target.selectedIndex].value;
   	
    resetSelect('size',  true);
    enableLabel('size',  false); 
    clearBtnFilters('size'); 

    // Next is Size
    if (thickSelected != 'none') {
      if (isFlagIdSet("PRDSEL",3) ||
    	  isFlagIdSet("PRDSEL",6)) { 
        loadSize(thickSelected);     
        enableSelect('size');
        enableLabel('size', true);
        $('select#uom').trigger("change");
       // Next is Size
      } else if (isFlagIdSet("PRDSEL",4)) {
        loadSize(thickSelected);	       
        enableSelect('size');
        enableLabel('size', true);
        $('select#uom').trigger("change");
      }
        else if (isFlagIdSet("PRDSEL",5)) {
	    uomS = UOM[shapeSelected.split("_")[1]][1];
	    loadUOM(uomS);
        enableSelect('uom');
        enableLabel('uom', true); 
        loadSize(thickSelected);
        enableSelect('size');
        enableLabel('size', true);
        // $('select#uom').trigger("change");
      }
    }
});
            
// "Size" selection
$(document).on('change', 'select#size', function (e) {
    // Retrieve value of selected size
    options = this.options[e.target.selectedIndex].value;
    wSelect = options.split('_');
    if (isFlagIdSet("PRDSEL",3) ||
    	isFlagIdSet("PRDSEL",6)) {    
      if (wSelect[0] != "any") {
        class1   = wSelect[0];	
        grade    = wSelect[1];	
        temper   = wSelect[2];	
        shape    = wSelect[3]; 
        thick    = wSelect[4];
        size1    = wSelect[5]; 
        size2    = wSelect[6];
        size3    = wSelect[7];
        size4    = wSelect[8];
        uom      = document.getElementById("uom").value;
        qty      = 1;  
        partInfo = "";
        dailyOfr = "";
        productSelector(partInfo, dailyOfr, qty, msg);
      }
    } else if (isFlagIdSet("PRDSEL",4)) {
      if (wSelect[0] != "any") {
        class1   = wSelect[0];	
        grade    = wSelect[1];	
        shape    = wSelect[2]; 
        thick    = wSelect[3];
        size1    = wSelect[4]; 
        size2    = wSelect[5];
        size3    = wSelect[6];
        size4    = wSelect[7];
        uom      = document.getElementById("uom").value;
        temper   = "";
        qty      = 1;  
        partInfo = "";
        dailyOfr = "";
        productSelector(partInfo, dailyOfr, qty, msg);
      }
    } else if (isFlagIdSet("PRDSEL",5)) {
      if (wSelect[0] != "any") {
        class1   = wSelect[0];	
        shape    = wSelect[1]; 
        grade    = wSelect[2];	
        temper   = wSelect[3];
        thick    = wSelect[4];
        size1    = wSelect[5]; 
        size2    = wSelect[6];
        size3    = wSelect[7];
        size4    = wSelect[8];

        if (!size4) {
          grade    = null;	
          temper   = null;
          thick    = wSelect[2];
          size1    = wSelect[3]; 
          size2    = wSelect[4];
          size3    = wSelect[5];
          size4    = wSelect[6];
        }
        
        uom      = document.getElementById("uom").value;
        qty      = 1;  
        partInfo = "";
        dailyOfr = "";
        productSelector(partInfo, dailyOfr, qty, msg);
      }
    }
});
            
// "UOM" selection
$(document).on('change', 'select#uom', function (e) {
    if (isFlagIdSet("PRDSEL",3) ||
        isFlagIdSet("PRDSEL",6)) {
       if ($('select#thick option:selected').val() == "any") {
    	 options = $('select#shape option:selected').val();  
       } else {
         options = $('select#thick option:selected').val();
       }
       wSelect  = options.split('_');

       if (wSelect[0] != "any") {
         class1 = wSelect[0];	
         grade  = wSelect[1];
         temper = wSelect[2];
         shape  = wSelect[3]; 
         if ($('select#thick option:selected').val() == "any") {
           thick = ""; 
         } else {
           thick = wSelect[4];
         }
         if (typeof size1 == 'undefined') { //Added 06/16/21
           size1 = 'ANY'; 
           size2 = 'ANY';
           size3 = 'ANY';
           size4 = 'ANY';        	 
         }
       }
    } else  if (isFlagIdSet("PRDSEL",4)) {
       options = $('select#thick option:selected').val();
       wSelect = options.split('_');
       if (wSelect[0] != "any") {
         class1 = wSelect[0];	
         grade  = wSelect[1];	
         shape  = wSelect[2]; 
         thick  = wSelect[3];
         temper = "";
         if (typeof size1 == 'undefined') { //Added 06/16/21
           size1  = 'ANY'; 
           size2  = 'ANY';
           size3  = 'ANY';
           size4  = 'ANY';
         }
       }
    } else if (isFlagIdSet("PRDSEL",5)) {
        if ($('select#thick option:selected').val() == "any") {
          options = $('select#shape option:selected').val();  
        } else {
          options = $('select#thick option:selected').val();
        }
        wSelect  = options.split('_');
 
        if (wSelect[0] != "any") {
          class1 = wSelect[0];	
          shape  = wSelect[1]; 
          grade  = wSelect[2];
          temper = wSelect[3];
          if ($('select#thick option:selected').val() == "any") {
            thick = ""; 
          } else {
            thick = wSelect[4];
          }
          if (typeof size1 == 'undefined') { //Added 06/16/21
            size1 = 'ANY'; 
            size2 = 'ANY';
            size3 = 'ANY';
            size4 = 'ANY';        	 
          }
        }
    }
    qty      = 1; 
    uom      = document.getElementById("uom").value;  //Load uom here only 06/16/21 
    partInfo = "";
    dailyOfr = "";

    // functions.js/productSelector(qty,msg)
    productSelector(partInfo, dailyOfr, qty, msg);
});

//"Grade" selection
$(document).on('change', 'select#tag', function (e) {

});

// UOM Dropdown Change
$(document).on('click', '.uom-dropdown-item', function (e) {
    var val = e.target.text;

    $('.uom-dropdown-btn').text(val);

    if (val == "INCHES") {
        val = "inch"
    } else {
        val = val.toLowerCase();
    };
    $('.uom-dropdown-btn').prev('input').val(val);
});

$(document).on('focusout', 'input#qty', function (e) {
    	if (loggedIn) {
        if ($(this).val() === '') {
            $(this).val(tmpInput);
        }
        var currentVal = $(this).val();
        var storedVal  = tmpInput;
        if (currentVal !== storedVal) {                     	
            var item    = $(this).attr('item');
            var partnbr = $(this).attr('partnbr');
            // If Part Number loaded need to use it in productSelector
            var psItem  = '';
            if (partnbr > '') {
            	psItem = partnbr;
            } else {
            	psItem = item;
            }
            var qty     = $(this).val();
            var items = [];
            item = String(item).padStart(5, '0');
            //alert(item);
            if($(this).attr('partnbr') === '' && $(this).attr('dailyofr') === '') {
                var leng = document.getElementById('ssLen'+item).value;
                var widt = document.getElementById('ssWid'+item).value;

                /*var u1 = document.getElementById('ssLenUOM'+item).value;
                if(u1 !== 'inch') leng = leng*12;
                var u2 = document.getElementById('ssWidUOM'+item).value;
                if(u2 !== 'inch') widt = widt*12;*/

                
            } else {
                var leng = $(this).attr('len');
                var widt = $(this).attr('wid');
                //items[0] = {ITEMNO:item,CUSTITEM:partnbr};
            }
            //alert(leng);
            items[0] = {ITEMNO:item,CUSTITEM:partnbr,LENGTH:leng,WIDTH:widt};
            itemLookup(items, uom, qty, '');  
        } else {
            var item = $(this).attr('item');
            $('a#btnUpdate[item="' + item + '"]').hide();
            $('a#btnItem[item="' + item + '"]').show();
        }
    }
});
            
$(document).on('focus', 'input#qty', function (e) {
    clearInput(this);
    var item = $(this).attr('item');
    $('a#btnItem[item="' + item + '"]').hide();
    $('a#btnUpdate[item="' + item + '"]').show();
});

$(document).on('focusout', 'input#uom', function (e) {
	if (loggedIn) {
        if ($(this).val() === '') {
            $(this).val(tmpInput);
        }
        var currentVal = $(this).val();
        var storedVal  = tmpInput;
        if (currentVal !== storedVal) {                      	
            var item    = $(this).attr('item');
            var partnbr = $(this).attr('partnbr');
            // If Part Number loaded need to use it in productSelector
            var psItem  = '';
            if (partnbr > '') {
            	psItem = partnbr;
                uomDft = uomDft;
            } else {
            	psItem = item;
            	uomDft = uom[0];
            } 
            uom     = $(this).val();
            // Check UOM to make sure it's changed to either EA or LB (no others)
            if (uom == 'ea') {
            	uom = 'EA';
            }else if (uom == 'lb') {
            	uom = 'LB';
            }else if (uom!=='EA' && uom!=='LB'){ 
            	uom = uomDft;
            }
            var items = [];
            items[0] = {ITEMNO:item,CUSTITEM:partnbr};
            itemLookup(items, uom, qty, '');  
        } else {
            var item = $(this).attr('item');
            $('a#btnUpdate[item="' + item + '"]').hide();
            $('a#btnItem[item="' + item + '"]').show();
        }
    }
});

$(document).on('focus', 'input#uom', function (e) {
    clearInput(this);
    var item = $(this).attr('item');
    $('a#btnItem[item="' + item + '"]').hide();
    $('a#btnUpdate[item="' + item + '"]').show();
});

//hide footer when input box is on focus & viewed on mobile device
$(document).on('focus', 'input, textarea', function() {
    if( isMobile.any() ) {
        $("div[data-role=footer]").hide();
    }
});

//show footer when input is NOT on focus & viewed on mobile device
$(document).on('blur', 'input, textarea', function() {
    if( isMobile.any() ) {
        $("div[data-role=footer]").show();
    }
});
            
$(document).keypress(function(e) {
    if (e.target.className === 'login' && e.keyCode === 13) {
        jsonLogin();
    }
                
    if (e.target.id === 'qty' && e.keyCode === 13) {
        $('input#qty').blur();
    }
});

$( window ).on( "orientationchange", function( event ) {
    getWindowDimensions();
    uiMod(true);
    setGridHeight(true);
});

$( window ).on( "resize", function( event ) {
    getWindowDimensions();
    uiMod(true);
    setGridHeight(true);
});


// ---------------------------------------------------------------------------------------
// ---------------------------------- CHECKOUT PAGE --------------------------------------
// ---------------------------------------------------------------------------------------

$(document).on('change', 'select#ship-freight', function (e) {
    var freight = this.options[e.target.selectedIndex].value;
    
    if (freight === "COLLECT") {
        enableLabelMod('carrier', true);
        enableForm('carrier', true);
    } else {
        enableLabelMod('carrier', false);
        enableForm('carrier', false);
    }
});

$(document).on('submit', 'form#order-info', function(event) {
    		
			// If QUOTES, PO and Request Date not required
			if ($('select#quote-order option:selected').val() === "QUOTE") {
    			$("input#po-number").prop('required',false);
    			$("#h3orderSubmit").html("Your quote has been submitted.");
    		} else {
    			$("input#po-number").prop('required',true);
    			$("#h3orderSubmit").html("Your order has been submitted.");
    		}
    
			// Prevent Form from Submitting
            event.preventDefault();
            
            // Check Form Validity
            if (!this.checkValidity()) {
                // Form Not Valid  
                // Identify and Mark Invalid Fields
                var firstInvalid = true;
                var firstEleID = "";
                $('form#order-info :input[required="required"], form#order-info select[required="required"]').each(function() {
                    if ($(this).is('select')) {
                        if ($(this).val() === 'none') {
                            if (firstInvalid) {
                                // Identify First Invalid Field and Expand Collapsible
                                var parent = $(this).parents('div[data-role="collapsible"]');
                                $('#' + parent[0].id).collapsible('expand');
                                firstInvalid = false;
                                firstEleID = this.id;
                            }
                            $('label[for="' + this.id + '-button"]').addClass('invalid');
                            $('span#' + this.id + '-button').addClass('invalid');
                            $('span#' + this.id + '-button span.ui-icon').addClass('invalid');
                        } else {
                            $('label[for="' + this.id + '-button"]').removeClass('invalid');
                            $('span#' + this.id + '-button').removeClass('invalid');
                            $('span#' + this.id + '-button span.ui-icon').removeClass('invalid');
                        }
                    }
                    if (!this.validity.valid) {
                        if (firstInvalid) {
                            // Identify First Invalid Field and Expand Collapsible
                            var parent = $(this).parents('div[data-role="collapsible"]');
                            $('#' + parent[0].id).collapsible('expand');
                            firstInvalid = false;
                            firstEleID = this.id;
                        }
                        $('label[for="' + this.id + '"]').addClass('invalid');
                        $('input#' + this.id).addClass('invalid');
                        //$(this).focus();
                    } else {
                        $('label[for="' + this.id + '"]').removeClass('invalid');
                        $('input#' + this.id).removeClass('invalid');
                    }
                });
               
                // Open Popup Window and then Focus on First Invalid Element when Closed
                openPopup('invalidInfo', '', '', firstEleID, '');
                return false;
            } else {
                // Form Valid
                processOrder();
            }
        });
        
        $('form#order-info :input[required="required"], form#order-info select[required="required"]').on('change', function() { 
            //$(this).trigger('input'); 
        });

