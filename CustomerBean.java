/*
 * CustomerBean.java
 *
 * Created on February 18, 2007, 10:16 PM
 */

package com.paragon.metalware;

import java.beans.*;
import java.io.Serializable;
import java.io.*;
import javax.servlet.http.*;
import com.paragon.db2.*;
import java.sql.*;
import java.util.*;

/**
 * @author Jeffrey
 */
public class CustomerBean extends Object implements Serializable {
    String eccid      = "";          
    String eccpwd     = "";         
    int eccar_num     = 0;       
    int eccis_num     = 0;       
    String ecccnt     = "";         
    String eccphn     = "";         
    String eccce      = "";          
    String eccinv     = "";         
    String eccprc     = "";         
    String ecctyp     = "";
    String ecques     = "";
    String eccans     = "";
    String VendorNo   = "";       
    String CustName   = "";
    DB2jdbcCon db2con = null;
    HashMap custFlags = new HashMap();
    boolean useAcctManage = false;
    boolean LoggedOnAsGuest = false;
    boolean PublicOrderEntryMode = true;  
    HashMap<String, TreeMap<String,String>> UOMMap = new HashMap<String, TreeMap<String,String>>();
    TreeMap<String, String> frtTerms = new TreeMap<String, String>();
    String neutralBol   = "";
    String cartID       = "";
    String dailyOfr     = "";
    String guestCompany = "";
    String guestUser    = "";
    String guestPhone   = "";
    String guestEmail   = "";
    boolean combinable  = false;
    
    public CustomerBean() {}
    
    public String getResPath() {
        return Globals.getResBundlePath();
    }
    
    public String getAppVersion() {
        return Globals.AppVersion;
    }
    
    public boolean authenticate(HttpSession session, String user, String pass, String flag){
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
        boolean loginok = false;
        //this.LoggedOnAsGuest = false;
        System.out.println(Globals.getSysProp("TemplatePath"));
        try {   
            //DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".CUSTLOGIN");
            CallableStatement cs = db2con.getCon().prepareCall("{CALL "+Globals.getSysProp("spLibrary")+".CUSTLOGIN(?,?,?)}");
            cs.setString(1, Globals.getSysProp("tblLibrary"));
            cs.setString(2, user.toUpperCase());
            cs.setString(3, pass.toUpperCase());
            //sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
            //sp.setParm("USERNAME", user.toUpperCase()); 
            //sp.setParm("PASSWORD", pass.toUpperCase()); 
            //ResultSet rs = sp.executeQuery();
            System.out.println("We're updated");
            ResultSet rs = cs.executeQuery();
                if (rs.next()) { 
                    setEccid(rs.getString("ECCID").trim());
                    setEccpwd(rs.getString("ECCPWD").trim());                                          
                    setEccar_num(new Integer(rs.getInt("ECCAR#")).intValue());
                    setEccis_num(new Integer(rs.getInt("ECCIS#")).intValue());                    
                    setEccphn(rs.getString("ECCPHN").trim());
                    setEccce(rs.getString("ECCCE").trim());
                    setEccinv(rs.getString("ECCINV").trim());
                    if (eccinv.trim().equals("")){
                        setEccinv(rs.getString("DEFAULT_UOM").trim());
                    }
                    setEccprc(rs.getString("ECCPRC").trim());
                    setEcctyp(rs.getString("ECCTYP").trim());                  
                    setEcccnt(rs.getString("ECCCNT").trim());
                    this.VendorNo = rs.getString("ECCVND#").trim();
                    setEccans(rs.getString("ECCANS").trim());
                    setEcques(rs.getString("ECQUES").trim());
                    getCustFlags();                  
                    this.CustName = rs.getString("CUSTNAME").trim();
                    this.LoggedOnAsGuest = false;
                    if (session != null || (session == null && flag == "1")) {
                        this.PublicOrderEntryMode = false;
                    }
                    loadUOMMap();
                    String frtCode = rs.getString("FRTCODE");
                    loadFrtTerms(user.toUpperCase(), frtCode);
                    setNeutralBol(rs.getString("NEUTRAL_BOL"));
                    loginok = true;
                } 
             rs.close();
             
        }  catch (Exception ex) {
            if (session != null) session.setAttribute( "ERROR","Authentication Error: "+ex.toString());
            ex.printStackTrace();
        } 
        db2con.close(); 
        return loginok;
    }
    
    public boolean logonAsGuest(String flag) {
   	    String guestPW   = Globals.getSysProp("CreateAcctAutoLoginPW");
    	String guestUser = Globals.getSysProp("CreateAcctAutoLoginAcct");
   	  // If User ID equal to Guest ID return true.
   	  if (guestUser == getUserID() || getUserID().equals("")) {
   		boolean auth = this.authenticate(null, guestUser, guestPW, flag);
   		if (auth) this.LoggedOnAsGuest = true;
   		  return auth;
      // Not logged in as Guest		  
   	  } else {
   		  return false;
   	  }
    }
 
    public boolean getLoggedIn() {
        boolean loggedIn = false; 
        int custno = getEccar_num();
        if ((custno != 100001 && custno != 199999)) {
        	loggedIn = true;
        }
        return loggedIn;
    }
    
    void getCustFlags() {
        int custno = getEccar_num();
        
        String userid = getUserID();
        if (custno == 0) return;
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"), Globals.getSysProp("username"), Globals.getSysProp("password"));
        try {   
            DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETCUSTFLAGS");
            
            sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
            sp.setParm("CUSTNO", custno); 
            sp.setParm("USERID", userid);

            ResultSet rs = sp.executeQuery();
            
            CustFlags cf = null;
            String FlagID = "";
            if (!eccans.equals("") && !eccpwd.toUpperCase().equals("PASSWORD")){
                while (rs.next()) {
                    FlagID = rs.getString("FLGFLD").trim();
                    if (!FlagID.equals("")) {                    
                        cf = new CustFlags(rs);
                        custFlags.put(FlagID,cf);
                    }    
                }
            }

            sp.clearParms();
            sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
            sp.setParm("CUSTNO", custno); 
            sp.setParm("USERID", userid); 

            rs = sp.executeQuery();
            while (rs.next()) {
                FlagID = rs.getString("FLGFLD").trim();
                if (!FlagID.equals("")) {                    
                    if (!eccans.equals("") && !eccpwd.toUpperCase().equals("PASSWORD")){
                        cf = (CustFlags)custFlags.get(FlagID);
                        //if (cf==null)
                        cf = new CustFlags(rs);
                        custFlags.put(FlagID,cf);
                    }else{
                        if (FlagID.trim().equals("ACT") && rs.getString("FLGF01").trim().equals("1")){
                            useAcctManage = true;
                            custFlags = new HashMap();
                            cf = new CustFlags(rs);
                            custFlags.put(FlagID,cf);
                            rs.close();
                            db2con.close();
                            return;
                        }
                    }
                }    
            }          
        }  catch (Exception ex) {
            ex.printStackTrace();
        } 
        db2con.close();     
    }
    
    public String getCustFlag(String FlagKey, int idx) {
        String flg = "";
        if (custFlags.containsKey(FlagKey))
            flg = ((CustFlags)custFlags.get(FlagKey)).getFlag(idx);
        return flg;
    }
    
    public String getCustFlagJSArray(){
        String js = "";
        for (Iterator it = custFlags.keySet().iterator(); it.hasNext(); ) {
           String key = (String)it.next();
           js += "optFlags['" + key + "'] = [";
           js += ((CustFlags)custFlags.get(key)).getFlagJSArray() + "," + ((CustFlags)custFlags.get(key)).getStrsJSArray()+ "];\n";
        }
        return (js.equals("")) ? "" : "var optFlags = new Array();\n" + js + "\n";
    }
    
    public boolean getIsCartSelectItem() {
        return Globals.getSysProp("cartInterface").equals("SelectItem");
    }
    public String getCartTabNumber() {
      String tabNo = Globals.getSysProp("initTabNumber");
      return (tabNo.equals("")) ? "0" : tabNo;
    }
    
    public String getTemplatePath() {
        return com.paragon.metalware.Globals.getSysProp("TemplatePath");
    }
    
    //Type
    public void setEcctyp(String value) {
        ecctyp = value;
    }
    public String getEcctyp  () {
        return ecctyp;
    }
    //Price UOM
    public void setEccprc(String value) {
        eccprc = value;
    }
    public String getEccprc  () {
        return eccprc;
    }
    //Inventory UOM
    public void setEccinv(String value) {
        eccinv = value;
    }
    public String getEccinv  () {
        return eccinv;
    }
    public String getCustomerUOM() {
        return eccinv;
    }
    
    //Contact Email
    public String getEmail  () {
       return eccce;
    }
    
    public void setEccce(String value) {
        eccce = value;
    }

    public String getEccce  () {
        return eccce;
    }
    //Contact Phone
     public void setEccphn(String value) {
        eccphn = value;
    }
    public String getEccphn  () {
        return eccphn ;
    }
    //Combinable 
    public void setCombinable(boolean value) {
       combinable = value;
   }
   public boolean getCombinable () {
       return combinable;
   }
    //Contact Name
    public String getContactName() {
        return ecccnt;
    }
    public void setEcccnt(String value) {
        ecccnt = value;
    }
    public String getEcccnt  () {
        return ecccnt ;
    }
    //Inside Sales Number
     public void setEccis_num(int value) {
        eccis_num = value;
    }
     public int getEccis_num() {
        return eccis_num;
    }
     
    public String getInsideSalesDistNo() {
        return String.valueOf(eccis_num).substring(0,1);
    } 
    public String getInsideSalesNo() {
        String n = String.valueOf(eccis_num);
        return n.substring(n.length()-2);
    }
    
    //Customer Number
    public void setEccar_num(int value) {
            
        eccar_num = value;
    }
     public int getEccar_num  () {
     
        return eccar_num ;
    }
     public String getCustomerNo() {
        String cno = String.valueOf(eccar_num);
        String cno5 = "00001";
        if (!cno.equals("0")) {
          cno5 = cno.substring(cno.length()-5);
          if (cno5.equals("00000")) {
            cno5 = "00001";
          }
        }
        return cno5;
    } 
    public String getDistrictNo() {
        String cno = "0000000" + String.valueOf(eccar_num);
        String cno2 = cno.substring(cno.length()-7).substring(0,2);
        if (cno2.equals("00")) {
            cno2 = "01";
        }       
        return cno2;
    } 
    public String getVendorNo() {
        String cno = "0000000" + String.valueOf(this.VendorNo);
        return cno.substring(cno.length()-6);
    }
    public String getCustomerName() {
        return this.CustName;
    } 
     public void setEccpwd(String value) {
        eccpwd = value;
    }
     public String getEccpwd  () {
        return eccpwd;
    }
    //Customer ID
    public String getUserID() {
      return eccid ; 
    } 
    public void setEccid(String value) {
        eccid = value;
    }
    public String getEccid  () {
        return eccid ;
    }
      
    public void setEccans(String value) {
        eccans = value;
    }

    public String getEccans() {
        return eccans;
    }
    
    public void setEcques(String value) {
        ecques = value;
    }

    public String getEcques() {
        return ecques;
    }

    public boolean getFormsEnabled(){
        return getCustFlag("FORMS",1).equals("1");
    }
    
    // Guest Info
    public boolean isLoggedOnAsGuest() {
        return this.LoggedOnAsGuest;
    }
    public void setGuestCompany(String value) {
        guestCompany = value;
    }
    public String getGuestCompany() {
        return guestCompany;
    }
    public void setGuestUser(String value) {
        guestUser = value;
    }
    public String getGuestUser() {
        return guestUser;
    }
    public void setGuestPhone(String value) {
        guestPhone = value;
    }
    public String getGuestPhone() {
        return guestPhone;
    }
    public String getGuestEmail() {
        return guestEmail;
    }
    public void setGuestEmail(String value) {
        guestEmail = value;
    }
    
    public HashMap getCustDemographics() {
        HashMap map = new HashMap();
        
        DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));
        DB2sql db2 = new DB2sql(db2con.getCon());
        
        String sql = "SELECT CCUSTN AS CustName, CADDR1 As Address, CCITY As City, CSTAT As State, CZIP As Zip " +
                        "FROM " + Globals.getSysProp("tblLibrary") + ".ARCUST " +
                        "WHERE CRECD = 'A' AND CDIST = " + this.getDistrictNo() + " AND CCUST = " + this.getCustomerNo();
        try {
            ResultSet rs = db2.executeQuery(sql);
            if (rs!=null && rs.next()) {    
                map.put("CustName", rs.getString("CustName").trim());
                map.put("CustAddr", rs.getString("Address").trim());
                map.put("CustCity", rs.getString("City").trim());
                map.put("CustState", rs.getString("State").trim());
                map.put("CustZip", rs.getString("Zip").trim());
            } 
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        } 
        db2con.close();   
        return map;
    }
    
    private void loadUOMMap() { 
        TreeMap <String, String> UOMType = null;
        try {
            DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));
            DB2sql db2 = new DB2sql(db2con.getCon()); 

            String sql = "SELECT * FROM " + Globals.getSysProp("tblLibrary") + ".WEBUOM ";
            ResultSet rs = db2.executeQuery(sql);
            if (rs!=null) {    
                while (rs.next()) {
                    String type = rs.getString("UOMTYPE");
                    UOMType = UOMMap.get(type);
                    if (UOMType == null) {
                        UOMType = new TreeMap();
                        UOMMap.put(type, UOMType);
                    }
                    UOMType.put(rs.getString("UOMCODE").trim(), rs.getString("UOMDESC").trim());
                }
                rs.close();
            } else {
                loadDefaultUOMMap();
            }
        } catch (Exception e) {
            e.printStackTrace();
            loadDefaultUOMMap();
        }  
        db2con.close();
    }
    
    private void loadDefaultUOMMap() {
       TreeMap <String, String> UOMType = null;
       UOMType = new TreeMap();
       UOMType.put("EA", "Each");
       UOMType.put("FT", "Feet");
       UOMType.put("IN", "Inch");
       UOMType.put("LB", "Pounds");
       UOMType.put("M", "Meters");
       UOMType.put("SFT", "Sq. Feet");
       UOMMap.put("Q", UOMType);
       UOMMap.put("P", UOMType);
    } 
       
    public Map getQtyUOM() {
        return UOMMap.get("Q");
    }
    
    public TreeMap getPriceUOM() {
      return UOMMap.get("P");  
    }

    public void loadFrtTerms(String user, String termsCode) {      
        try {
             DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));
             DB2sql db2 = new DB2sql(db2con.getCon()); 
             this.frtTerms.clear();
             String sql = "SELECT distinct ttrmcd,tdesc,flgf15 " +
                          "FROM " + Globals.getSysProp("tblLibrary") + ".TERMS " +
            		      "JOIN " + Globals.getSysProp("tblLibrary") + ".WEBCUSTFLG " +
                          "ON FLGID = " + "'" + user + "'" + " " +
            		      "AND FLGFLD = 'OE' " +
                          "WHERE ttrmky='FT' " + 
                    	  "AND (tlang='ENG' or tlang='   ') " + 
                  	      "AND trecd='A' " +
                  	      "ORDER BY ttrmcd";
             ResultSet rs = db2.executeQuery(sql);
             while (rs.next()) {
               // Lock Freight Terms dropdown to only 1 option
               if ((rs.getString("flgf15").equals("1"))) {
                 if (rs.getString("ttrmcd").equals(termsCode)) {
                   String trmcd = rs.getString("ttrmcd");
                   String tdesc = rs.getString("tdesc"); 
                   this.frtTerms.put(trmcd,tdesc);
                 }
               // Load all Freight Terms for customer default with selection.
               } else {
                 String trmcd = rs.getString("ttrmcd");
                 String tdesc = rs.getString("tdesc"); 
                 this.frtTerms.put(trmcd,tdesc);
               }
             }
             rs.close();
            } catch (Exception e) {
              e.printStackTrace();
            }  
            db2con.close();
  	}

    public TreeMap getFrtTerms() {
        return frtTerms;  
      }

    public String getNeutralBol() {
        return neutralBol;  
      }
    
    public void setNeutralBol(String value) {
        neutralBol = value;
    }
    
    public void setPublicOrderEntry() {
        this.PublicOrderEntryMode = true;
    }
    public boolean getPublicOrderEntry() {
        return this.PublicOrderEntryMode;
    }
    
    public String getCartID() {
        return this.cartID;
    }
    
    public void setCartID(String value) {
        cartID = value;
    }
    
    public boolean getActEnabled(){
        return getCustFlag("ACT",1).equals("1");
    }
    
    public boolean getAREnabled(){
        return getCustFlag("AR",1).equals("1");
    }
    
    public boolean getARStmtEnabled(){
        return getCustFlag("AR",2).equals("1");
    }
    
    public boolean getAROpenEnabled(){
        return getCustFlag("AR",3).equals("1");
    }
    
    public boolean getARPaidEnabled(){
        return getCustFlag("AR",4).equals("1");
    }      
    public boolean getConEnabled(){
        return getCustFlag("CON",1).equals("1");
    }
    public boolean getConFilter(){
        return getCustFlag("CON",4).equals("1");
    }  

    public boolean getGEEnabled(){
        return getCustFlag("GE",1).equals("1");
    }

    public boolean getOEOrderEnabled(){
        return getCustFlag("OE",3).equals("1");
    }    
    
    public boolean getOEQuoteEnabled(){
        return getCustFlag("OE",4).equals("1");
    }
    
    public boolean getOEPriceEnabled(){
        return getCustFlag("OE",9).equals("1");
    }  
    
    public boolean getOESupQtyCnvEnabled(){
        return getCustFlag("OE",16).equals("1");
    }  
          
    public boolean getPayEnabled(){
        return getCustFlag("PAY",1).equals("1");
    }
    
    public boolean getPSsel1() {
    	return getCustFlag("PRDSEL",2).equals("1");
    }    
    public boolean getPSsel2() {
		return getCustFlag("PRDSEL",3).equals("1");
    }
    public boolean getPSsel3() {
		return getCustFlag("PRDSEL",4).equals("1");
    }        
    public boolean getPSsel4() {
		return getCustFlag("PRDSEL",5).equals("1");
    }
    public boolean getPSsel5() {
    	return getCustFlag("PRDSEL",6).equals("1");
    }
    
    public boolean getDlyOfr(){
        return getCustFlag("DLYOFR",1).equals("1");
    }
    
    public boolean getUtilEnabled(){
        return getCustFlag("UTIL",1).equals("1");
    }
    
    public boolean getVMIEnabled(){
        return getCustFlag("VMI",1).equals("1");
    }
    
    public String getInsideSalesmanEmail() {
    	
    	DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));
        DB2sql db2 = new DB2sql(db2con.getCon());
    	String sDist = getInsideSalesDistNo();
        String sNum = getInsideSalesNo();
        
        //String sql = "SELECT EMEMAL FROM " + Globals.getSysProp("tblLibrary") + ".EMPLOYE " +
          //      "WHERE EMSMDI = " + sDist + " AND EMSLMN = " + sNum ;
        //System.out.println(sDist+"--"+sNum);
        //sNum = "1";
        String sql = "SELECT EMEMAL FROM " + Globals.getSysProp("tblLibrary") + ".EMPLOYE WHERE EMSMDI=" + sDist + " AND EMSLMN=" + sNum;         		
        
        String sEmail = "";
        try {
            ResultSet rs = db2.executeQuery(sql);
            if (rs!=null && rs.next()) {    
                sEmail = rs.getString("EMEMAL").trim();
            } 
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        db2con.close();
        return sEmail;
        //return "sEmail Inside Sales";
    }
    
    public String getInsideSalesmanName() {
    	
    	DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));
        DB2sql db2 = new DB2sql(db2con.getCon());
    	String sDist = getInsideSalesDistNo();
        String sNum = getInsideSalesNo();
        
        //String sql = "SELECT EMEMPN FROM " + Globals.getSysProp("tblLibrary") + ".EMPLOYE " +
        //        "WHERE EMSMDI = " + sDist + " AND EMSLMN = " + sNum ;
        //System.out.println(sDist+"--"+sNum);
        //sNum = "1";
        String sql = "SELECT EMEMPN FROM " + Globals.getSysProp("tblLibrary") + ".EMPLOYE WHERE EMSMDI=" + sDist + " AND EMSLMN=" + sNum;         		
        
        String sName = "";
        try {
            ResultSet rs = db2.executeQuery(sql);
            if (rs!=null && rs.next()) {    
                sName = rs.getString("EMEMPN").trim();
            } 
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        db2con.close();
        return sName;
        //return "sName Inside Sales";
    }
    
public String getOutsideSalesmanEmail() {
    	
    	DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));
        DB2sql db2 = new DB2sql(db2con.getCon());
    	String sDist = getInsideSalesDistNo();
        String custNum = getCustomerNo();
        String sEmail = "";
        //System.out.println(sDist+"-Out-"+custNum);
        //custNum = "112";
        //String sql = "SELECT E.EMEMAL FROM " + Globals.getSysProp("tblLibrary") + ".ARCUST A, "+ Globals.getSysProp("tblLibrary") + ".EMPLOYE E " +
          //      "WHERE A.CSMDI1 = " + sDist + " AND A.CMSLMN1 = " + sNum + " AND E.EMSMDI = A.CSMDI1 AND E.EMSLMN = A.CMSLMN1";
        String sql = "SELECT smemal from " + Globals.getSysProp("tblLibrary") + ".webcust join " + Globals.getSysProp("tblLibrary") + ".arcust on substr(digits(eccar#),1,2)=cdist and substr(digits(eccar#),3,5)=ccust join " + Globals.getSysProp("tblLibrary") + ".salesman on digits(csmdi1)=smdist and digits(cslmn1)=smsman where cdist=" + sDist + " and ccust=" + custNum;        
        try {
            ResultSet rs = db2.executeQuery(sql);
            if (rs!=null && rs.next()) {    
                sEmail = rs.getString("SMEMAL").trim();
            } 
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        db2con.close();
        return sEmail;
        //return "sEmail Outside Sales";
    }
    
    public String getOutsideSalesmanName() {
    	
    	DB2jdbcCon db2con = new DB2jdbcCon(Globals.getSysProp("localString"),Globals.getSysProp("username"),Globals.getSysProp("password"));
        DB2sql db2 = new DB2sql(db2con.getCon());
    	String sDist = getInsideSalesDistNo();
    	String custNum = getCustomerNo();
        String sName = "";
        //System.out.println(sDist+"-OutName-"+custNum);
        //custNum = "112";
        //String sql = "SELECT E.EMEMAL FROM " + Globals.getSysProp("tblLibrary") + ".ARCUST A, "+ Globals.getSysProp("tblLibrary") + ".EMPLOYE E " +
          //      "WHERE A.CSMDI1 = " + sDist + " AND A.CMSLMN1 = " + sNum + " AND E.EMSMDI = A.CSMDI1 AND E.EMSLMN = A.CMSLMN1";
        String sql = "SELECT smname from " + Globals.getSysProp("tblLibrary") + ".webcust join " + Globals.getSysProp("tblLibrary") + ".arcust on substr(digits(eccar#),1,2)=cdist and substr(digits(eccar#),3,5)=ccust join " + Globals.getSysProp("tblLibrary") + ".salesman on digits(csmdi1)=smdist and digits(cslmn1)=smsman where cdist=" + sDist + " and ccust=" + custNum;        
        
        try {
            ResultSet rs = db2.executeQuery(sql);
            if (rs!=null && rs.next()) {    
                sName = rs.getString("SMNAME").trim();
            } 
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        db2con.close();
        return sName;
        //return "sName Outside Sales";
    }
}
