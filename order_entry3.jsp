<%--                                 
    Document   : order_entry3                                                                         
    Created on : Oct 13, 2014, 10:07:29 AM                                   
    Author     : rlusk                       
--%>   
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>   
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>  
   
     
<%@include file="PageHeader.jsp"%> 
    
<%-- Set Page Type Variables --%>     
<c:set var="page" value="ProductSelector"/>      
<c:set var="fontawesome" value="true"/>    
<c:set var="bootstrap" value="true"/>
<c:set var="slickslider" value="true"/> <%-- Added as part of new order entry design --%>
                                     
                
<!DOCTYPE html>       
<html>         
    <head>    
        <title>Metalweb ${customerBean.appVersion}</title>
        <style>    
          tr.border-bottom td {
             border-bottom: 1pt solid white;
             padding: 7px;
          }
          tr.border-bottom th {
             border-bottom: 1pt solid white;
             padding: 7px;
          }
        </style>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <%@include file="CustFlagsJS.jsp"%> 
        <%@include file="HeadCSS.jsp"%>    
        <%@include file="HeadJS.jsp"%>              
    </head>    
    <body class="open-sans-font">     
        <div class="ui-loader-background"> </div>              
        <div data-role="page">     
              
            <%@include file="Popups.jsp"%>     
            <jsp:include page="${customerBean.templatePath}/HeaderJSON.jsp"/>  
            <%@include file="NavBar.jsp"%>  

            <%-- Hidden Selects (used to reduce modifications to existing functions and events) --%> 
            <div class="hide">
              <select name="cls" id="cls" data-mini="true">
                <option value="none">* None Selected</option>    
              </select> 
              <select name="shape" id="shape" data-mini="true" disabled>
                <option value="none">* None Selected</option>
              </select>   
              <select name="grade" id="grade" data-mini="true" disabled> 
                <option value="none">* None Selected</option>
              </select>
              <select name="sspec" id="sspec" multiple="multiple" data-native-menu="false">
                <option value="none" selected>* None Selected</option>
              </select> 
              <select name="temper" id="temper" data-mini="true" disabled> 
                <option value="none">* None Selected</option>   
              </select>   
              <select name="shape" id="shape" data-mini="true" disabled>
                <option value="none">* None Selected</option>
              </select> 
              <select name="thick" id="thick" data-mini="true" disabled> 
                <option value="none">* None Selected</option>
              </select>
              <select name="size" id="size" data-mini="true" disabled> 
                <option value="*ANY">* Any Selected</option>
              </select>
              <select name="uom" id="uom" data-mini="true" disabled>  
                <option value="none">* None Selected</option> 
              </select>
            </div>
                   
            <div role="main" class="ui-content">  

              <%-- Daily & Part Number Select Filters --%> 
              <div class="row">
                <div class="col-sm-6">
                  <c:if test="${customerBean.getDlyOfr()==true}">                              
                    <select name="daily" id="daily" data-mini="true" class="open-sans-font"> 
                      <option value="none"><fmt:message key="PS_DAILY"/></option>     
                    </select>
                  </c:if>  
                </div>
                <div class="col-sm-6">
                  <c:if test="${customerBean.getPSsel2()==true
                              or customerBean.getPSsel3()==true
                              or customerBean.getPSsel4()==true}">                              
                    <select name="part" id="part" data-mini="true" class="open-sans-font"> 
                      <option value="none"><fmt:message key="PS_PART"/></option>     
                    </select>
                  </c:if>
                </div>
              </div>

              <%-- Product Search - Class Img Slider (Filter) --%> 
              <div class="row mb-3 mt-3" style="min-height:160px;">
                <div class="class-slider" id="product-classes">
                	<div id="cls-loader" style="height:160px" class="d-flex flex-column justify-content-center align-items-center"><div><img src="images/icon_red.png" class="logo-spinner" /> <!-- <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i> --></div><span class="mt-3 open-sans-font fw-bold fs-6 d-flex align-items-center justify-content-center logo-spinner-txt no-txt-shadow">Loading Classes...</span></div>
                    
                </div>
              </div>

              <%-- Product Search - Button Style Filters --%>
              <div class="row-filtering">

                <div id="grade-options" style="display:none">
                  <div class="d-flex align-items-baseline filter-container mb-2">
                    <h3 class="fw-bold me-3"><fmt:message key="PS_GRD"/></h3>
                    <div class="btn-group btn-group-sm" role="group">
                      
                    </div>
                  </div>
                </div>

                <div id="sspec-options" style="display:none">
                  <div class="d-flex align-items-baseline filter-container mb-2">
                    <h3 class="fw-bold me-3"><fmt:message key="PS_SPC"/></h3>
                    <div class="btn-group btn-group-sm" role="group">
                      
                    </div>
                  </div>
                </div>

                <div id="temper-options" style="display:none">
                  <div class="d-flex align-items-baseline filter-container mb-2">
                    <h3 class="fw-bold me-3"><fmt:message key="PS_TMP"/></h3>
                    <div class="btn-group btn-group-sm" role="group">
                      
                    </div>
                  </div>
                </div>
  
                <div id="shape-options" style="display:none">
                  <div class="d-flex align-items-baseline filter-container mb-2">
                    <h3 class="fw-bold me-3"><fmt:message key="PS_SHP"/></h3>
                    <div class="btn-group btn-group-sm" role="group">
                      
                    </div>
                  </div>
                </div>

                <div id="thick-options" style="display:none">
                  <div class="d-flex align-items-baseline filter-container mb-2">
                    <h3 class="fw-bold me-3"><fmt:message key="PS_THK"/></h3>
                    <div class="btn-group btn-group-sm" role="group">
                      
                    </div>
                  </div>
                </div>

                <div id="size-options" style="display:none">
                  <div class="d-flex align-items-baseline filter-container mb-2">
                    <h3 class="fw-bold me-3" style="width: 98px;"><fmt:message key="PS_SIZ"/></h3>
                    <div class="btn-group btn-group-sm" role="group">
                      
                    </div>
                  </div>
                </div>

                <div id="uom-options" style="display:none">
                  <div class="d-flex align-items-baseline filter-container mb-2">
                    <h3 class="fw-bold me-3"><fmt:message key="PS_UOM"/></h3>
                    <div class="btn-group btn-group-sm" role="group">
                      
                    </div>
                  </div>
                </div>

              </div>

              <div class="container-fluid mt-3" id="product-list-box" style="background-color:#eeeeee;min-height:50vh;">
                <div class="container-fluid px-1 py-1">
                  <div id="product-listings" class="d-flex row">
                    <c:if test="${customerBean.getLoggedIn() =='false' && customerBean.getGEEnabled()=='false'}"> 
                      <h3 class="mt-3 open-sans-font fw-bold">Please Sign In or Contact our Customer Service Department.</h3>
                    </c:if> 
                    <c:if test="${customerBean.getLoggedIn() =='true' || customerBean.getGEEnabled()=='true'}"> 
                      <h3 class="mt-3 open-sans-font fw-bold" id="locate-product-title">Use the Product Selector to locate a product.</h3>
                    </c:if>
                  </div>
                </div>
              </div>

          </div><!-- /content --> 
          <%@include file="Footer.jsp"%> 
          <%@include file="ShopCart.jsp"%> 
        </div><!-- /page --> 

    </body> 
</html>
