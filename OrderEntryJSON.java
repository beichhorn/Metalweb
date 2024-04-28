/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.paragon.metalware.orderentry;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.*;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.*;

import com.paragon.metalware.Globals;
import com.paragon.metalware.PropertiesBean;

/**
 *
 * @author osolis
 */
public class OrderEntryJSON extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        try {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet OrderEntryJSON</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet OrderEntryJSON at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        } finally {
            out.close();
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        PrintWriter out = response.getWriter();
      
        HttpSession ses = request.getSession(false);        
        com.paragon.metalware.CustomerBean cb = 
                (com.paragon.metalware.CustomerBean)ses.getAttribute("customerBean");

                String userID = cb.getUserID();

                FileWriter geek_file; 
                geek_file = new FileWriter("/home/BEICHHORN/FLAGS.txt", true);
                BufferedWriter geekwrite = new BufferedWriter(geek_file);
                geekwrite.write(userID + System.lineSeparator());
                geekwrite.write(cb.getPSsel1() + System.lineSeparator());
                geekwrite.write(cb.getPSsel2() + System.lineSeparator());
                geekwrite.write(cb.getPSsel3() + System.lineSeparator());
                geekwrite.write(cb.getPSsel4() + System.lineSeparator());
                geekwrite.write(cb.getPSsel5() + System.lineSeparator());
                geekwrite.close();
                            
        // Initial Product Selector modes Base = "2" and Admiral = "3" and Old Metalweb = "1"
        // Order_Entry3.jsp/HeadJS.jsp function.js-getOEJSON/OrderEntryJSON
        if (cb.getPSsel1()==false) {
            OrderEntryBean oeb = new OrderEntryBean();
            response.setContentType("application/json;charset=UTF-8");
            if (cb.getPSsel2()==true || 
                cb.getPSsel5()==true) {
              out.println(oeb.getProdSel02JSON(cb.getDistrictNo(), cb.getCustomerNo(), cb.getEccid()));
            } else if (cb.getPSsel3()==true) {
                out.println(oeb.getProdSel03JSON(cb.getDistrictNo(), cb.getCustomerNo(), cb.getEccid()));
            } else if (cb.getPSsel4()==true) {
                out.println(oeb.getProdSel04JSON(cb.getDistrictNo(), cb.getCustomerNo(), cb.getEccid()));
            } else {
                out.println(oeb.getProdGradeSpecsJSON(cb.getDistrictNo(), cb.getCustomerNo()));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //processRequest(request, response);

        PrintWriter out = response.getWriter();  
        String action = request.getParameter("action").trim();

        if (action.equals("itemsearch")) {

            OrderEntryItemsBean items = new OrderEntryItemsBean(request);             
            items.setType("");
            items.setCls1(request.getParameter("cls"));
            items.setGrade(request.getParameter("grade"));            
            items.setTemper(request.getParameter("temper"));
            items.setShape(request.getParameter("shape"));
            items.setThick(request.getParameter("thick"));
            items.setSel1(request.getParameter("sel1"));
            // Info will only be loaded when everything else is empty
            if ((request.getParameter("cls")).isEmpty()) {
                
                if ((request.getParameter("partInfo")).isEmpty()) {
                    items.setDailyOfr(request.getParameter("dailyOfr"));            	
                } else {           	
                    items.setPartInfo(request.getParameter("partInfo"));
                }
            }

            response.setContentType("application/json;charset=UTF-8"); 
            out.println(items.getProdItemsJSON());
            
  
        }    
        else if (action.equals("uomlookup")){
            OrderEntryItemsBean shapeuom = new OrderEntryItemsBean(request);
            shapeuom.setuShape(request.getParameter("shape"));
            shapeuom.setuQryType(request.getParameter("type"));
            
            response.setContentType("application/json;charset=UTF-8");            
            out.println(shapeuom.getShapeUOMJSON());
            } 
        else if (action.equals("itemlookup")) {
            OrderEntryCartXML cart = new OrderEntryCartXML();
            String itemno  = request.getParameter("itemno");
            String qty     = request.getParameter("qty");
            String uom     = request.getParameter("uom");
            String partnbr = request.getParameter("partnbr");
            String dailyofr= request.getParameter("dailyofr");
            String length = request.getParameter("length1");
            String width= request.getParameter("width1");
            
            response.setContentType("application/json;charset=UTF-8");
            out.println(cart.getCartItemJSON(request.getSession(), itemno, qty, uom, partnbr, dailyofr, length, width));
        	}
        else if (action.equals("invView")) {
        	// feed from function.js/openpop
            OrderEntryCartXML cart = new OrderEntryCartXML();
            String itemNo = request.getParameter("itemno");
            String partnbr= request.getParameter("partnbr");
            String dailyofr= request.getParameter("dailyofr");
            
            response.setContentType("application/json;charset=UTF-8");
            out.println(cart.getInventorySummaryJSON(request.getSession(), itemNo, partnbr, dailyofr)); 
        	}
        else if (action.equals("invViewTags_View")) {
        	// feed from function.js/openpopup 
            OrderEntryCartXML cart = new OrderEntryCartXML();
            String distNo  = request.getParameter("distno"); 
            String itemno  = request.getParameter("itemno");
            String dailyofr= request.getParameter("dailyofr");

            response.setContentType("application/json;charset=UTF-8");
            out.println(cart.getCartTagJSON(request.getSession(), distNo, itemno, dailyofr)); 
        	}
        else if (action.equals("invViewTags_Usedlines")) {
            OrderEntryCartXML cart = new OrderEntryCartXML();
            String distNo = request.getParameter("distno");
            String itemno = request.getParameter("itemno");

            response.setContentType("application/json;charset=UTF-8");
            out.println(cart.getCartTagJSON(request.getSession(), distNo, itemno, ""));
        	}
    	}

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
