/*
 * OrderEntryItemsBean.java
 *
 * Created on August 28, 2007, 2:49 PM
 */
package com.paragon.metalware.orderentry;

import com.paragon.metalware.CustomerBean;
import com.paragon.metalware.Globals;
import com.paragon.metalware.controller.*;
import java.beans.*;
import java.io.Serializable;
import java.io.*;
import com.paragon.db2.*;
import java.sql.*;
import javax.servlet.http.*;

import org.w3c.dom.*;
import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.stream.*;
import javax.xml.transform.dom.*;
import java.util.*;
import org.apache.commons.lang3.StringUtils;
import org.json.simple.*;

/**
 * @author osolis
 */
public class OrderEntryItemsBean extends Object implements Serializable {

    private String itemType   = "";
    private String srchType   = "";
    private String srchVal    = "";
    private String itemCat    = "";
    private String itemClass  = "";
    private String itemGrade  = "";
    private String itemTemper = ""; 
    private String itemShape  = "";
    private String itemThick  = "";;
    private String itemWidth  = "";
    private String itemLength = "";
    private String uomShape   = "";
    private String uomQType   = "";
    private String itemSize1  = "";
    private String itemSize2  = "";
    private String itemSize3  = "";
    private String itemSize4  = "";
    private String itemSel1   = "";
    private String itemSel2   = "";
    private String itemSel3   = "";
    private String itemSel4   = "";
    private String partInfo   = "";
    private String dailyOfr   = "";

    HttpServletRequest request = null;
    HttpSession ses = null;

    public OrderEntryItemsBean() {

    }

    public OrderEntryItemsBean(HttpServletRequest request) {
        this.request = request;
        this.ses = request.getSession(false);
    }

    public void setType(String value) {
        this.itemType = value;
    }

    public void setSrchType(String value) {
        this.srchType = value;
    }

    public void setSrchVal(String value) {
        this.srchVal = value;
    }

    public void setCat(String value) {
        this.itemCat = value;
    }

    public void setCls1(String value) {
        this.itemClass = value;
    }
    
    public void setGrade(String value) {
        this.itemGrade = value;
    }
    
    public void setTemper(String value) {
        this.itemTemper = value;
    }

    public void setShape(String value) {
        this.itemShape = value;
    }
    
    public void setThick(String value) {
        this.itemThick = value;
    }
    
    public void setSel1(String value) {
        this.itemSel1 = value;
    }
    
    public void setSel2(String value) {
        this.itemSel2 = value;
    } 
    
    public void setSel3(String value) {
        this.itemSel3 = value;
    }    
    
    public void setSel4(String value) {
        this.itemSel4 = value;
    } 
    public void setWidth(String value) {
        this.itemWidth = value;
    }

    public void setLength(String value) {
        this.itemLength = value;
    }

    public void setuShape(String value) {
        this.uomShape = value;
    }

    public void setuQryType(String value) {
        this.uomQType = value;
    }

    public void setSize1(String value) {
        this.itemSize1 = value;
    }

    public void setSize2(String value) {
        this.itemSize2 = value;
    }

    public void setSize3(String value) {
        this.itemSize3 = value;
    }

    public void setSize4(String value) {
        this.itemSize4 = value;
    }
    
    public void setPartInfo(String value) {
    	this.partInfo = value;
    }
    
    public void setDailyOfr(String value) {
    	this.dailyOfr = value;
    }
    
    public String getType() {
        return this.itemType;
    }

    public String getCat() {
        return this.itemCat;
    }

    public String getCls1() {
        return this.itemClass;
    }
    
    public String getGrade() {
        return this.itemGrade;
    }

    public String getTemper() {
        return this.itemTemper;
    }
    
    public String getShape() {
        return this.itemShape;
    }

    public String getThick() {
        return this.itemThick;
    }

    public String getSel1() {
        return this.itemSel1;
    }

    public String getSel2() {
        return this.itemSel2;
    }   

    public String getSel3() {
        return this.itemSel3;
    }

    public String getSel4() {
        return this.itemSel4;
    }
   
    public String getWidth() {
        return this.itemWidth;
    }

    public String getLength() {
        return this.itemLength;
    }

    public String getSize1() {
        return this.itemSize1;
    }

    public String getSize2() {
        return this.itemSize2;
    }

    public String getSize3() {
        return this.itemSize3;
    }

    public String getSize4() {
        return this.itemSize4;
    }
    
    public String getPartInfo() {
    	return this.partInfo;
    }
    
    public String getDailyOfr() {
    	return this.dailyOfr;
    }
    
    public String getProdItemsXML() {
        DB2jdbcCon db2con = null;
        com.paragon.metalware.CustomerBean cb = null;
        if (ses != null) {
            cb = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        }
        String custNo = (cb == null) ? "" : cb.getCustomerNo();
        String distNo = (cb == null) ? "" : cb.getDistrictNo();
        String custOwned = (cb == null) ? "" : cb.getCustFlag("OE", 10);
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));

        if (itemType == null || this.itemType.equals("")) {
            return "<Error>Invalid Query Parameters Specified</Error>";
        } else {
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEMS6");
            sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
            sp.setParm("TYPECODE", getType());
            sp.setParm("CATCODE", getCat());
            sp.setParm("GRADE", getGrade());
            sp.setParm("ITEMNO", "");
            sp.setParm("CUSTID", custNo); 
            sp.setParm("DISTRICT", distNo);
            sp.setParm("OWNED", custOwned);
            sp.executeQuery();
            return sp.getResultSetXML();
        }
    }

    public String getProdItemsJSON() {
        DB2jdbcCon db2con = null;
        com.paragon.metalware.CustomerBean cb = null;      
        if (ses != null) {
            cb = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        }
        String custNo = (cb == null) ? "" : cb.getCustomerNo();
        String distNo = (cb == null) ? "" : cb.getDistrictNo();
        String custOwned = (cb == null) ? "" : cb.getCustFlag("OE", 10);
        String partInfo  = getPartInfo();
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));

        try {        	
        	// Daily Offering Selection
        	if (getDailyOfr() != null && !getDailyOfr().isEmpty()) {
        		// Data comes from GETPRODITSD
        		DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM90");
        		sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                sp.setParm("DISTRICT", distNo);
                sp.setParm("LIST", getDailyOfr());     
                String see = getDailyOfr();
                sp.executeQuery();
                return sp.getResultSetJSON();
        	// Partnbr Selection
        	} else if (getPartInfo() != null && !getPartInfo().isEmpty()) {
                String [] item   = partInfo.split("_");
        		DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM91");
                sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                sp.setParm("DIST", distNo);
                sp.setParm("CUST", custNo);
                sp.setParm("ITEM", item[0]);
                sp.executeQuery();
                return sp.getResultSetJSON();
            // Product Selector 
            } else if ((cb.getPSsel2()==true) || 
            		   (cb.getPSsel5()==true)) {
        		if (getSel1().equals("ANY")) {
            		DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM2A");            
                    sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                    sp.setParm("DIST", distNo);
                    sp.setParm("CLS", getCls1());
                    sp.setParm("GRD", getGrade());
                    sp.setParm("TMP", getTemper());
                    sp.setParm("SHP", getShape());
                    sp.setParm("THK",  getThick());
                    sp.executeQuery();
                    return sp.getResultSetJSON();
        		} else {
        		  DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM2S");            
                  sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                  sp.setParm("DIST", distNo);
                  sp.setParm("CLS", getCls1());
                  sp.setParm("GRD", getGrade());
                  sp.setParm("TMP", getTemper());
                  sp.setParm("SHP", getShape());
                  sp.setParm("THK", getThick());
                  sp.setParm("SEL1", getSel1());     
                  sp.setParm("SEL2", getSel2());   
                  sp.setParm("SEL3", getSel3());   
                  sp.setParm("SEL4", getSel4());                        
                  sp.executeQuery();
                  return sp.getResultSetJSON();
        		}
        	// Product Select 3
            } else if (cb.getPSsel3()==true) {
     		if (getSel1().equals("ANY")) {
         		DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM3A");            
                 sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                 sp.setParm("DIST", distNo);
                 sp.setParm("CLS", getCls1());
                 sp.setParm("GRD", getGrade());
                 sp.setParm("SHP", getShape());
                 sp.setParm("THK", getThick());
                 sp.executeQuery();
                 return sp.getResultSetJSON();
     		} else {
     		  DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM3S");            
               sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
               sp.setParm("DIST", distNo);
               sp.setParm("CLS", getCls1());
               sp.setParm("GRD", getGrade());
               sp.setParm("SHP", getShape());
               sp.setParm("THK", getThick());
               sp.setParm("SEL1", getSel1());     
               sp.setParm("SEL2", getSel2());   
               sp.setParm("SEL3", getSel3());   
               sp.setParm("SEL4", getSel4());
               //System.out.println(sp);
               sp.executeQuery();
               return sp.getResultSetJSON();
     		}
     		// Product Select 4
            } else if (cb.getPSsel4()==true) {
                
        		if (getSel1().equals("ANY")) {
            		DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM4A");            
                    sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                    sp.setParm("DIST", distNo);
                    sp.setParm("CLS", getCls1());
                    sp.setParm("GRD", getGrade());
                    sp.setParm("TMP", getTemper());
                    sp.setParm("SHP", getShape());
                    sp.setParm("THK",  getThick());
                    sp.executeQuery();
                    return sp.getResultSetJSON();
        		} else if (!getGrade().equals("")) {
        		  DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM4S"); 
                  sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                  sp.setParm("DIST", distNo);
                  sp.setParm("CLS", getCls1());
                  sp.setParm("GRD", getGrade());
                  sp.setParm("TMP", getTemper());
                  sp.setParm("SHP", getShape());
                  sp.setParm("THK", getThick());
                  sp.setParm("SEL1", getSel1());     
                  sp.setParm("SEL2", getSel2());   
                  sp.setParm("SEL3", getSel3());   
                  sp.setParm("SEL4", getSel4());                        
                  sp.executeQuery();
                  return sp.getResultSetJSON();
        		}  else {
                    DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM4P"); 
                    try {
                        FileWriter file = new FileWriter("/home/BEICHHORN/Select.txt");
                        BufferedWriter bf = new BufferedWriter(file);
                        bf.write(" GET GRADE IS BLANK");
                        bf.write(getGrade());
                        bf.close(); 
                    }  catch (Exception e) {
                        e.printStackTrace();
                    }
    
                    sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                    sp.setParm("DIST", distNo);
                    sp.setParm("CLS", getCls1());
                    sp.setParm("SHP", getShape());
                    sp.setParm("THK", getThick());
                    sp.setParm("SEL1", getSel1());     
                    sp.setParm("SEL2", getSel2());   
                    sp.setParm("SEL3", getSel3());   
                    sp.setParm("SEL4", getSel4());                        
                    sp.executeQuery();
                    return sp.getResultSetJSON();
                }
            // Auto advance "ANY"
        	} else if(getSel1().equals("ANY")) {
                DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM88");            
                
                sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
                sp.setParm("DIST", distNo);
                sp.setParm("CLS", getCls1());
                sp.setParm("GRD", getGrade());
                sp.setParm("TMP", getTemper()); 
                sp.setParm("SHP", getShape());
                sp.setParm("THK", getThick());      	 	                
                sp.executeQuery();
                return sp.getResultSetJSON();        		
            // Drill down Selection
        	} else {
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEM89");            
            sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
            sp.setParm("DIST", distNo);
            sp.setParm("CLS", getCls1());
            sp.setParm("GRD", getGrade());
            sp.setParm("TMP", getTemper()); 
            sp.setParm("SHP", getShape());
            sp.setParm("SEL1", getSel1());     
            sp.setParm("SEL2", getSel2());   
            sp.setParm("SEL3", getSel3());   
            sp.setParm("SEL4", getSel4());
            sp.executeQuery();
            return sp.getResultSetJSON();
        	} 
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"Error\":\"" + e.getMessage() + "\"}";  
        }
        //}
    }

    public String getProdItemsXML(String itemNo) {
        DB2jdbcCon db2con = null;
        com.paragon.metalware.CustomerBean cb = null;
        if (ses != null) {
            cb = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        }
        String custOwned = (cb == null) ? "" : cb.getCustFlag("OE", 10);
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));
        if (itemNo == null || itemNo.equals("")) {
            return "<Error>Item Number Not Specified</Error>";
        } else {
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODITEMS6");
            sp.setParm("OWNED", custOwned);
            sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
            sp.setParm("TYPECODE", "");
            sp.setParm("CATCODE", "");
            sp.setParm("GRADE", "");
            sp.setParm("ITEMNO", itemNo);
            sp.setParm("CUSTID", (cb == null) ? "" : cb.getCustomerNo());
            sp.setParm("DISTRICT", (cb == null) ? "" : cb.getDistrictNo());
            sp.executeQuery();
            return sp.getResultSetXML();
        }
    }

    public String getOrderItemsXML(HttpServletRequest request, String itemsType) {
        DB2jdbcCon db2con = null;
        String xml = "";
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));
        HttpSession ses = request.getSession(false);
        com.paragon.metalware.CustomerBean cb
                = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETORDQUOTITEMS3");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
        sp.setParm("DISTRICT", cb.getDistrictNo());
        sp.setParm("CUSTNUM", cb.getCustomerNo());
        sp.setParm("ORDNUM", srchVal);
        sp.setParm("ITEMSTYPE", itemsType);
        sp.setParm("SRCHTYPE", srchType);
        ResultSet rs = sp.executeQuery();

        if (itemsType.equals("F")) {
            xml = sp.getResultSetXML();
            if (xml.equals("")) {
                xml = "<DB2RecSet></DB2RecSet>";
            }
        } else {
            xml = getOrderSetXML(sp);
        }
        return xml;
    }
    
    public String getOrderItemsJSON(HttpServletRequest request, String itemsType, String queryType) {
        DB2jdbcCon db2con = null;
        StringBuilder json = new StringBuilder();
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));
        HttpSession ses = request.getSession(false);
        com.paragon.metalware.CustomerBean cb
                = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETORDQUOTITEMS3");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
        sp.setParm("DISTRICT", cb.getDistrictNo());
        sp.setParm("CUSTNUM", cb.getCustomerNo());
        sp.setParm("ORDNUM", srchVal);
        sp.setParm("ITEMSTYPE", itemsType);
        sp.setParm("SRCHTYPE", srchType);
        ResultSet rs = sp.executeQuery();
        String districtNumberAppended  = null;
        String wDistrictNumberAppended = null;
        String orderNumberAppended     = null;
        String WOrderNumberAppended    = null;
        String wCustom                 = null;
        if (Globals.getSysProp("TemplatePath").equals("Templates/admiral")) {
        	wCustom = "Admiral";     
        } else if (Globals.getSysProp("TemplatePath").equals("Templates/frisa")) {
        	wCustom = "Frisa";
        } else {
        	wCustom = "Metalweb";
        }
        
        json.append("[");
        if (queryType.equals("C") || queryType.equals("Q") || queryType.equals("O") || queryType.equals("S") || queryType.equals("B")) {
            try {
                boolean hasNext = rs.next();
                while (hasNext) {
                	// Append leading zeros if district number less than 2 chars.
                	districtNumberAppended = rs.getString("DISTRICT");
                    districtNumberAppended = ("00" + districtNumberAppended).substring(rs.getString("DISTRICT").length());
                                    	
                	// Append leading zeros if order number less than 6 chars.
                	orderNumberAppended = rs.getString("ORDERNO");
                    orderNumberAppended = ("000000" + orderNumberAppended).substring(rs.getString("ORDERNO").length());

                    // Only load Header info once per order (RS has all the lines on the order)
                    if (!districtNumberAppended.equals(wDistrictNumberAppended) ||
                    	!orderNumberAppended.equals(WOrderNumberAppended)) {
                    	
                    	// Load comma for next Header
                        if (wDistrictNumberAppended != null) {
                        	json.append(",");                        	
                        }
                        
                    	wDistrictNumberAppended = districtNumberAppended;
                    	WOrderNumberAppended    = orderNumberAppended;
                    	json.append("{\"ORDTYPE\":\""   + rs.getString("ORDTYPE")                            + "\","+
                    			     "\"DISTRICT\":\""  + districtNumberAppended                             + "\","+
                    				 "\"CUSTNO\":\""    + rs.getString("CUSTNO")                             + "\","+
                    				 "\"CUSTNAME\":\""  + rs.getString("CUSTNAME")                           + "\","+
                    				 "\"REQDATE\":\""   + rs.getString("REQDATE")                            + "\","+
                    				 "\"ORDERDATE\":\"" + rs.getString("ORDERDATE")                          + "\","+                    				 
                    				 "\"ORDERNO\":\""   + orderNumberAppended                                + "\","+
                    				 "\"ORDERCMT\":\""  + JSONObject.escape(rs.getString("ORDERCMT").trim()) + "\","+
                    				 "\"NETAR\":\""     + rs.getString("NETAR")                              + "\","+
                    				 "\"CUSTOM\":\""    + wCustom                                            + "\","+
                    				 "\"CARTNAME\":\""  + JSONObject.escape(rs.getString("CARTNAME").trim()) + "\"}");
                    }
                    hasNext = rs.next();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (queryType.equals("I")) {
            try {
                boolean hasNext = rs.next();
                while (hasNext) {
                	// Append leading zeros if district number less than 2 chars.
                	districtNumberAppended = rs.getString("DISTRICT");
                    districtNumberAppended = ("00" + districtNumberAppended).substring(rs.getString("DISTRICT").length());
                    json.append("{\"SHIPDATE\":\""   + rs.getString("SHIPDATE")                           + "\","+
                                 "\"LINENO\":\""     + rs.getString("LINENO")                             + "\","+
                                 "\"ITEMNO\":\""     + rs.getString("ITEMNO")                             + "\","+
                                 "\"DESC\":\""       + JSONObject.escape(rs.getString("DESC").trim())     + "\","+ 
                                 "\"STATUS\":\""     + rs.getString("STATUS")                             + "\","+
                                 "\"QTY\":\""        + rs.getString("QTY")                                + "\","+
                                 "\"UOM\":\""        + rs.getString("UOM")                                + "\","+
                                 "\"PRICE\":\""      + rs.getString("PRICE")                              + "\","+
                                 "\"WIDTH\":\""      + rs.getString("WIDTH")                              + "\","+
                                 "\"LENGTH\":\""     + rs.getString("LENGTH")                             + "\","+
                                 "\"INNERD\":\""     + rs.getString("INNERD")                             + "\","+
                                 "\"OUTERD\":\""     + rs.getString("OUTERD")                             + "\","+
                                 "\"WALLD\":\""      + rs.getString("WALLD")                              + "\","+
                                 "\"WEIGHT\":\""     + rs.getString("WEIGHT")                             + "\","+
                                 "\"EXTPRC\":\""     + rs.getString("EXTPRC")                             + "\","+
                                 "\"PRCUOM\":\""     + rs.getString("PRCUOM")                             + "\","+
                                 "\"LINECMT\":\""    + rs.getString("LINECMT")                            + "\","+
                                 "\"BOL\":\""        + rs.getString("BOL")                                + "\","+
                                 "\"CUSTITEM\":\""   + rs.getString("CUSTITEM")                           + "\","+
                                 "\"ITEMSTATUS\":\"" + rs.getString("ITEMSTATUS")                         + "\","+
                                 "\"ORDTYPE\":\""    + rs.getString("ORDTYPE")                            + "\","+
                                 "\"DISTRICT\":\""   + districtNumberAppended                             + "\","+
                                 "\"CERTFLAG\":\""   + rs.getString("CERTFLAG")                           + "\","+
                    			 "\"CUSTNAME\":\""   + rs.getString("CUSTNAME")                           + "\","+
                				 "\"CUSTOM\":\""     + wCustom                                            + "\","+
                                 "\"ORDERCMT\":\""   + JSONObject.escape(rs.getString("ORDERCMT").trim()) + "\"}");
                    hasNext = rs.next();
                    if (hasNext) {
                        json.append(",");
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (queryType.equals("J")) {
                    districtNumberAppended = "01";                             
                    json.append("{\"DISTRICT\":\"" + districtNumberAppended + "\"}");
        }
        json.append("]");
        return json.toString();
    }

    public String getOrderItemsFormSearchXML(HttpServletRequest request) {
        DB2jdbcCon db2con = null;
        String xml = "";
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));
        HttpSession ses = request.getSession(false);
        com.paragon.metalware.CustomerBean cb
                = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETORDFORMSRCH");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
        sp.setParm("DISTRICT", cb.getDistrictNo());
        sp.setParm("CUSTNUM", cb.getCustomerNo());
        sp.setParm("SRCHVAL", srchVal);
        sp.setParm("SRCHTYPE", srchType);
        sp.executeQuery();

        xml = getOrderSetXML(sp);

        return xml;
    }
    
    public String getOrderItemsFormSearchJSON(HttpServletRequest request) {
        DB2jdbcCon db2con = null;
        String json = "";
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));
        HttpSession ses = request.getSession(false);
        com.paragon.metalware.CustomerBean cb
                = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETORDFORMSRCH");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
        sp.setParm("DISTRICT", cb.getDistrictNo());
        sp.setParm("CUSTNUM", cb.getCustomerNo());
        sp.setParm("SRCHVAL", srchVal);
        sp.setParm("SRCHTYPE", srchType);
        ResultSet rs = sp.executeQuery();

        //xml = getOrderSetXML(sp);

        return json;
    }

    public String getOrderSetXML(DB2storedproc sp) {
        ResultSet rs = sp.getResultSet();
        ResultSetMetaData mdata = sp.getResultMetaData();
        String colName = "";
        long grpCnt = 0;
        long recCnt = 0;
        String curOrdNo = "";
        String lastOrdNo = "";
        String distStr = "";
        String ordNoStr = "";
        try {
            DocumentBuilder docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            org.w3c.dom.Document doc = docBuilder.newDocument();
            Element parentNode = doc.createElement("Orders");
            Element grpNode = null;

            while (rs.next()) {
                curOrdNo = rs.getString("ORDERNO");
                if (!lastOrdNo.equals(curOrdNo)) {
                    if (grpNode != null) {
                        grpNode.setAttribute("itemcnt", String.valueOf(recCnt));
                    } else {
                        parentNode.setAttribute("district", rs.getString("DISTRICT"));
                        parentNode.setAttribute("custno", rs.getString("CUSTNO"));
                    }

                    grpNode = doc.createElement("Order");
                    //grpNode.setAttribute("OrderNo", curOrdNo);
                    parentNode.appendChild(grpNode);

                    Element colNode = doc.createElement("OrderNo");
                    Text colText = doc.createTextNode(curOrdNo);
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("OrderDate");
                    colText = doc.createTextNode(rs.getString("ORDERDATE").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("ReqDate");
                    colText = doc.createTextNode(rs.getString("REQDATE").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("ShipDate");
                    colText = doc.createTextNode(rs.getString("SHIPDATE").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("OrderComment");
                    colText = doc.createTextNode(rs.getString("ORDERCMT").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("OrderStatus");
                    colText = doc.createTextNode(rs.getString("STATUS").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    distStr = "0" + rs.getString("DISTRICT").trim();
                    distStr = distStr.substring(distStr.length() - 2);
                    ordNoStr = "000000" + rs.getString("ORDERNO").trim();
                    ordNoStr = ordNoStr.substring(ordNoStr.length() - 6);
                    colNode = doc.createElement("MWORDNO");
                    colText = doc.createTextNode(distStr + ordNoStr);
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("ARTotal");
                    colText = doc.createTextNode(rs.getString("NETAR").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("OrderType");
                    colText = doc.createTextNode(rs.getString("ORDTYPE").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("BOL");
                    colText = doc.createTextNode(rs.getString("BOL").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    colNode = doc.createElement("CartName");
                    colText = doc.createTextNode(rs.getString("CARTNAME").trim());
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    String CertFlag = "0";
                    try {
                        CertFlag = rs.getString("CERTFLAG").trim();
                    } catch (Exception e) {
                    }

                    colNode = doc.createElement("CERTFLAG");
                    colText = doc.createTextNode(CertFlag);
                    colNode.appendChild(colText);
                    grpNode.appendChild(colNode);

                    recCnt = 0;
                    grpCnt++;
                    lastOrdNo = curOrdNo;
                }

                Element recNode = doc.createElement("OrderItem");
                Text colText = null;
                for (int i = 1; i <= mdata.getColumnCount(); i++) {
                    colName = mdata.getColumnLabel(i);
                    Element colNode = doc.createElement(colName);
                    if (mdata.getColumnType(i) == Types.DECIMAL) {
                        colText = doc.createTextNode(Float.valueOf(rs.getString(colName)).toString().trim());
                    } else {
                        colText = doc.createTextNode(rs.getString(colName).trim());
                    }
                    colNode.appendChild(colText);
                    recNode.appendChild(colNode);
                }
                recCnt++;
                grpNode.appendChild(recNode);
            }

            parentNode.setAttribute("ordercnt", String.valueOf(grpCnt));
            return Globals.xmlToString(parentNode);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
    /* 
     String getDistInvQtyPage(com.paragon.metalware.CustomerBean cb, String itemNo) { 
     String html = "";
     DB2jdbcCon db2con = null;
     db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));  
     DB2storedproc sp = new DB2storedproc(db2con.getCon(), "MW4WEB.GETADINV");
     sp.setParm("CUSTNUM", cb.getCustomerNo());
     sp.setParm("DIST", cb.getDistrictNo());
     sp.setParm("ITEM", itemNo);
     ResultSet rs = sp.executeQuery();
     html = "<table class='DistInvQty'>";
     html += "<tr><th>District</th><th>Avail. Inv.</th><th>Inbound Qty.</th><th>Price</th><th>UOM</th></tr>";
     try {
     while (rs.next()) {  
     html += "<tr>";
     //rs.getString("OUTDIST");
     html += "<td>"+rs.getString("OUTDSTA")+"</td>";
     html += "<td>"+rs.getString("OUTQTY")+"</td>";
     html += "<td>"+rs.getString("OUTOQTY")+"</td>";
     html += "<td>"+rs.getString("OUTPRC")+"</td>";
     html += "<td>"+rs.getString("OUTUOM")+"</td>";
     html += "</tr>";
     }
     html += "</table>";    
     rs.close();
     db2con.close();
     } catch (Exception e) {
     html = e.getMessage();
     }
     return html;
     }
     */

    String getDistInvPartsXML(com.paragon.metalware.CustomerBean cb, String itemNo) {
        DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));
        String tableLib = Globals.getSysProp("tblLibrary");
        String xml;
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETITEMPARTS");
        sp.setParm("LIBNAME", tableLib);
        sp.setParm("DISTRICT", cb.getDistrictNo());
        sp.setParm("CUSTNUM", cb.getCustomerNo());
        //sp.setParm("ITEMNUM", itemNo);
        sp.setParm("ITEMNUM", "NOITM");
        ResultSet rs = sp.executeQuery();
        try {
            xml = sp.getResultSetXMLNoDec();
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
        db2con.close();
        return xml;
    }

    String getDistInvQtyXML(com.paragon.metalware.CustomerBean cb, String itemNo, String PartNo) {
        String xml = "";
        String DailyOfr = "";
        DB2jdbcCon db2con = null;
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
        try {
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETADINV");
            sp.setParm("CUSTNUM", cb.getDistrictNo() + cb.getCustomerNo());
            sp.setParm("DIST", cb.getDistrictNo());
            sp.setParm("ITEM", itemNo);
            sp.setParm("USERID", cb.getUserID());
            sp.setParm("PARTNO", (PartNo == null) ? "" : PartNo);
            sp.setParm("DAILYOFR", (DailyOfr == null) ? "" : DailyOfr);
            ResultSet rs = sp.executeQuery();
            if (rs != null) {
                xml = sp.getResultSetXML();
                if (xml.equals("")) {
                    xml = "<DB2RecSet></DB2RecSet>";
                }
            } else {
                xml = "<DB2RecSet></DB2RecSet>"; //<DB2Rec></DB2Rec>
            }

            rs.close();
            db2con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return xml;
    }
       
    String getDistInvTagXML(com.paragon.metalware.CustomerBean cb, String itemNo, String tagDist) {
        String xml = "";
        DB2jdbcCon db2con = null;

        if (itemNo.equals("")) {
            return "";
        }
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
        try {
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETADINVTAG");
            sp.setParm("CUSTNUM", cb.getDistrictNo() + cb.getCustomerNo());
            sp.setParm("DIST", (tagDist == null) ? cb.getDistrictNo() : tagDist);
            sp.setParm("ITEM", itemNo);
            sp.setParm("USERID", cb.getUserID());
            ResultSet rs = sp.executeQuery();
            if (rs != null) {
                xml = sp.getResultSetXML();
                if (xml.equals("")) {
                    xml = "<DB2RecSet></DB2RecSet>";
                }
            } else {
                xml = "<DB2RecSet></DB2RecSet>"; //<DB2Rec></DB2Rec>
            }

            //xml = "<DistInvQty><ItemNo>"+itemNo+"</ItemNo>"+xml+"</DistInvQty>";
            rs.close();
            db2con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return xml;
    }

    String getDistConTagXML(com.paragon.metalware.CustomerBean cb, String itemNo, String tagDist) {
        String xml = "";
        DB2jdbcCon db2con = null;

        if (itemNo.equals("")) {
            return "";
        }
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
        try {
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETADCONTAG");
            sp.setParm("CUSTNUM", cb.getDistrictNo() + cb.getCustomerNo());
            sp.setParm("DIST", (tagDist == null) ? cb.getDistrictNo() : tagDist);
            sp.setParm("ITEM", itemNo);
            sp.setParm("USERID", cb.getUserID());
            ResultSet rs = sp.executeQuery();
            if (rs != null) {
                xml = sp.getResultSetXML();
                if (xml.equals("")) {
                    xml = "<DB2RecSet></DB2RecSet>";
                }
            } else {
                xml = "<DB2RecSet></DB2RecSet>"; //<DB2Rec></DB2Rec>
            }

            //xml = "<DistInvQty><ItemNo>"+itemNo+"</ItemNo>"+xml+"</DistInvQty>";
            rs.close();
            db2con.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return xml;
    }

    String GetItemTagInfo(HttpServletRequest request) {
        try {
            String disNo = request.getParameter("dn");
            String ordNo = request.getParameter("on");
            String lneNo = request.getParameter("ln");
            String ordtype = request.getParameter("ot");
            DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
            HttpSession session = request.getSession(false);
            com.paragon.metalware.CustomerBean cb
                    = (com.paragon.metalware.CustomerBean) session.getAttribute("customerBean");
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETITEMTAGINFO");
            sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
            sp.setParm("DISTNO", disNo);
            sp.setParm("ORDNO", ordNo);
            sp.setParm("LINENO", lneNo);
            sp.setParm("ORDTYPE", ordtype);
            ResultSet rs = sp.executeQuery();
            String strRet = "";
            while (rs.next()) {
                int CertFlag = 0;
                try {
                    CertFlag = rs.getInt("CERTFLAG");
                } catch (Exception e) {
                }

                strRet = strRet + rs.getString("TAGNO").trim() + ";" + rs.getString("TAGHEATNO").trim() + ";"
                        + rs.getString("MILLCOILNO").trim() + ";"
                        + String.valueOf(rs.getInt("ODCERT")) + ";" + String.valueOf(rs.getInt("ODMILT")) + ";"
                        + StringUtils.right("0" + String.valueOf(rs.getInt("TAGDIST")), 2) + ";" + rs.getString("TAGITEM") + ";"
                        + String.valueOf(rs.getString("TAGDESC")) + ";"
                        + String.valueOf(rs.getInt("PODIST")) + ";" + String.valueOf(rs.getInt("PONUM")) + ";"
                        + String.valueOf(CertFlag) + "|";
            }
            return strRet;
        } catch (SQLException ex) {
            return "";
        }
    }
    
    String GetItemTagInfoJSON(HttpServletRequest request) {
        StringBuilder json = new StringBuilder();
        String disNo = request.getParameter("dn");
        String ordNo = request.getParameter("on");
        String lneNo = request.getParameter("ln");
        String ordtype = request.getParameter("ot");
        DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
        HttpSession session = request.getSession(false);
        com.paragon.metalware.CustomerBean cb
                = (com.paragon.metalware.CustomerBean) session.getAttribute("customerBean");
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETITEMTAGINFO");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary"));
        sp.setParm("DISTNO", disNo);
        sp.setParm("ORDNO", ordNo);
        sp.setParm("LINENO", lneNo);
        sp.setParm("ORDTYPE", ordtype);
        ResultSet rs = sp.executeQuery();

        // JS GetOrderInfo2 Order Line Item Tags
        json.append("[");
        try {
        	boolean hasNext = rs.next();
            while (hasNext) {
                json.append("{\"TAGNO\":\""      + rs.getString("TAGNO")                             + "\","+
                             "\"TAGHEATNO\":\""  + rs.getString("TAGHEATNO")                         + "\","+
                             "\"MILLCOILNO\":\"" + rs.getString("MILLCOILNO")                        + "\","+
                             "\"ODCERT\":\""     + rs.getString("ODCERT")                            + "\","+
                             "\"ODMILT\":\""     + rs.getString("ODMILT")                            + "\","+
                             "\"TAGDIST\":\""    + rs.getString("TAGDIST")                           + "\","+
                             "\"TAGITEM\":\""    + rs.getString("TAGITEM")                           + "\","+
                             "\"TAGDESC\":\""    + JSONObject.escape(rs.getString("TAGDESC").trim()) + "\","+
                             "\"PONUM\":\""      + rs.getString("PONUM")                             + "\","+
                             "\"CERTFLAG\":\""   + rs.getString("CERTFLAG")                          + "\"}");
                hasNext = rs.next();
                if (hasNext) {
                    json.append(",");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        json.append("]");
        return json.toString();
    }

    public String getShapeUOMJSON() {
        DB2jdbcCon db2con = null;
        com.paragon.metalware.CustomerBean cb = null;
        if (ses != null) {
            cb = (com.paragon.metalware.CustomerBean) ses.getAttribute("customerBean");
        }
        String custNo = (cb == null) ? "" : cb.getCustomerNo();
        String distNo = (cb == null) ? "" : cb.getDistrictNo();
        String custOwned = (cb == null) ? "" : cb.getCustFlag("OE", 10);
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
        try {
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETUOM");
            sp.setParm("SHAPE", uomShape);
            sp.setParm("STYPE", "Q");
            ResultSet rs = sp.executeQuery();
            return sp.getResultSetJSON();
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"Error\":\"" + e.getMessage() + "\"}";
        }
    }
}
