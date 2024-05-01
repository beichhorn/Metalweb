 <%-- 
    Document   : Index Metalweb page   
    Updated on : Jan 24, 2019     
    Author     : ges      
--%> 
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>    
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>   
<%@include file="PageHeader.jsp"%>     
<c:choose>  
  <c:when test="${customerBean.getPSsel1()==true}">  
    <% 
	if (customerBean.isLoggedOnAsGuest()) { 
      session.removeAttribute("customerBean");
    }
    if (pageContext.getSession().getAttribute("customerBean")!= null && !customerBean.getCustomerNo().equals("00000")) {
      String url = response.encodeRedirectURL("dashboard.jsp");
      pageContext.forward(url);
    }    
	%>
	<jsp:include page="/Templates/mcneilus/header.jsp"/>
	<%@include file="/WEB-INF/jspf/authentication_status.jspf" %>

	<%@include file="/WEB-INF/jspf/logon.jspf" %> 
  </c:when>   
  <c:when test="${customerBean.getPSsel4()==true}"> 
    <jsp:include page="/order_entry5.jsp"/>
  </c:when>
  <c:otherwise>
    <jsp:include page="/order_entry3.jsp"/>  
  </c:otherwise>
</c:choose>  

