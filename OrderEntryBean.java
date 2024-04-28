/*
 * OrderEntryBean.java
 *
 * Created on August 21, 2007, 2:17 PM
 */

package com.paragon.metalware.orderentry;

import com.paragon.metalware.Globals;
import com.paragon.metalware.controller.*;
import java.beans.*;
import java.io.Serializable;
import java.io.*;
import java.util.*;
import com.paragon.db2.*;
import java.sql.*;
import javax.servlet.http.*;
// import javax.servlet.jsp.*;

import org.json.simple.JSONObject;
/**
 * @author osolis
 */
public class OrderEntryBean extends Object implements Serializable {
    DB2jdbcCon db2con = null;
    String district = "";
    String custnum = "";
    HttpSession ses = null;
    String PrdTypeCats4 = "";
    String ProdGrad4    = "";
    
    public OrderEntryBean() {
        db2con = new DB2jdbcCon(Globals.getSysProp("localString"),
                Globals.getSysProp("username"),
                Globals.getSysProp("password"));
    }
    
    public void setSession(HttpSession value) {
        this.ses = value;
    }
    
    public void setDistrict(String value) {
        this.district = value;  
    }
    
    public void setCustNum(String value) {
        this.custnum = value;  
    }
    
    public ArrayList getProductTypes() {
        ArrayList a = new ArrayList();     
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODTYPES2");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
        ResultSet rs = sp.executeQuery();
        try {
            while (rs.next()) {
                a.add(sp.getRowMap(rs));
            }    
        } catch (Exception e) {
            e.printStackTrace();
        }
        return a;
    }
    // Initial Load of Order_Entry, Consignment and VMI
    public String getPrdTypeCats4() {
        if (!PrdTypeCats4.equals("")) return PrdTypeCats4;
        String lastType = "";
        String curType = "";
        String lastCat = "";
        String curCat = "";
        
        StringBuffer js = new StringBuffer();
        StringBuffer cats = new StringBuffer();
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRDTYPECATS4");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
        ResultSet rs = sp.executeQuery();
        try {
            while (rs.next()) {
                curType = rs.getString("TYPECODE").trim();
                if (!curType.equals(lastType)) {
                    if (!lastType.equals("")) {
                        cats.append("]];\n");
                        js.append(cats);
                    } else
                        js.append("var TypeCats = new Array();\n");
                    js.append("TypeCats[\"" + curType + "\"] = [[\"" + rs.getString("TYPEDESC").trim() + "\"],[");
                    cats.setLength(0);
                    lastType = curType;
                    lastCat = "";
                } else
                    cats.append(",");
                
                curCat =  rs.getString("CATCODE").trim();
                if (!curCat.equals(lastCat))
                    cats.append("[\"" + curCat +"\",\""+rs.getString("CATDESC").trim() + "\"]");
                lastCat = curCat;
            }    
            rs.close();
            cats.append("]];\n");
            js.append(cats);
            PrdTypeCats4 = js.toString();            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return js.toString();
    }
    // Initial load of Order_Entry,Consignment and VMI
    public String getProdGrad4() {
        if (!ProdGrad4.equals("")) return ProdGrad4;
        String lastType = "";
        String curType = "";
        StringBuffer js = new StringBuffer();
        StringBuffer cats = new StringBuffer();
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODGRAD4");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
        sp.setParm("TYPECODE", "");
        sp.setParm("CATCODE","");
        ResultSet rs = sp.executeQuery();
        String GradeStr = "";
        String GradeBlank = "";
        String FlagsBlank = "";
        String DispBlank = "";
        String FlagStack = "";
        String DispStack = "";
        int numGrades = 0;
        try {
            while (rs.next()) {
                curType = rs.getString("TYPECODE")+rs.getString("CATCODE");
                if (!curType.equals(lastType)) {
                   if (numGrades == 0 && !GradeBlank.equals("")) {
                      cats.append("TypeCatGrades[\"" + lastType + "\"] = [");
                      cats.append("[\"*\",\"" + FlagStack + "\",\"" + DispStack + "\"]");
                  } 
                    
                   if (!lastType.equals("")) {
                       if (cats.length()>0) {
                            cats.append("];\n");
                            js.append(cats);
                       }
                    } else
                        js.append("var TypeCatGrades = new Array();\n");
                    //js.append("TypeCatGrades[\"" + curType + "\"] = [");
                    cats.setLength(0);
                    GradeBlank = "";
                    lastType = curType;
                    numGrades = 0;
                    FlagStack = "";
                } 
               
                GradeStr = rs.getString("GRADE");
                if (GradeStr.length() == 2) {
                  GradeBlank = GradeStr;
                  FlagsBlank = rs.getString("SIZEFLAGS").trim();
                  DispBlank = rs.getString("DISPFLAGS").trim();
                  if (FlagsBlank.length() > FlagStack.length()) FlagStack = FlagsBlank;
                  if (DispBlank.length() > DispStack.length()) DispStack = DispBlank;
                } else {
                    if (cats.length() == 0)
                      js.append("TypeCatGrades[\"" + curType + "\"] = [");
                    else
                      cats.append(",");  
                    
                   if (GradeStr.substring(0,2).equals(GradeBlank)) {
                      cats.append("[\"" + GradeBlank + "\",\"" + FlagsBlank + "\",\"" + DispBlank + "\"],"); 
                      GradeBlank = "";
                   } 
                   cats.append("[\""+GradeStr + "\",\"" + rs.getString("SIZEFLAGS").trim() + "\",\"" + rs.getString("DISPFLAGS").trim() + "\"]");
                   numGrades++;
                } 
            } 
            rs.close();
            if (cats.length() > 0) {
                cats.append("];\n");
                js.append(cats);
            }
            ProdGrad4 = js.toString();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return js.toString();
    }  
  
    public String getProdGradeSpecsJSON(String cdist, String ccust) { 
        StringBuilder js1 = new StringBuilder();    	
        StringBuilder js2 = new StringBuilder();
        StringBuilder js3 = new StringBuilder();
        StringBuilder js4 = new StringBuilder();
        StringBuilder js5 = new StringBuilder();
        StringBuilder js6 = new StringBuilder();
        StringBuilder js7 = new StringBuilder();
        String js11   ="";String js11W="";
        String js22   ="";String js22W="";String js22C="";
        String js33   ="";String js33A="";String js33AC="";String js33W="";String js33C="";
        String js44   ="";String js44A="";String js44AC="";String js44W="";String js44C="";
        String js55   ="";String js55A="";String js55AC="";String js55W="";String js55C="";String js55D;
        String js66   ="";String js66W="";String js66C="";
        String js77   ="";String js77U="";String js77W="";
        String wDisp  ="";
        String gsType ="";
        String curType =""; 
            
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODGRADSPECS");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
        sp.setParm("CDIST", cdist);
        sp.setParm("CCUST", ccust);
        
        // Results used in getOEJSON (function.js)
        
        // Result set 1 of 7  
        ResultSet rs = sp.executeQuery();
        try {
            js11W="";js22W="";  
            js1.append("\"js1Data\":{");        	
            while (rs.next()) {
                js11=rs.getString("CLASS");            	
                js22=rs.getString("GRADE").trim();
                // 1st part of set 1
                js11=(js11.equals("")) ? "-" : js11;
                if (!js11W.equals(js11)) {
                    if (!js11W.equals("")) {
                        js1.append("]],");                   
                    }
                    js1.append("\"" + js11 + "\": [\"" + JSONObject.escape(rs.getString("CLSDSC").trim()) + "\",[");                    
                    js11W=js11;js22W="";
                }
                // 2nd part of set 1
                js22C=js11 +"_" + js22;
                js22C=(js22C.equals("")) ? "-" : js22C;
                if (!js22W.equals(js22C)) {
                    if (!js22W.equals("")) {
                        js1.append(",");
                    }
                    js1.append("[\"" + js22C + "\",\"" + js22 + "\"]");                     
                    js22W=js22C;
                }  
            }
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }        
        js1.append("]]}");        

        // Result set 2 of 7
        rs = sp.getNextResult(); 
        try {
            js22W="";js33W="";
            js2.append("\"js2Data\":{");        	    
            while (rs.next()) {            	
                js11=rs.getString("CLASS");
                js22=rs.getString("GRADE").trim();
                js33=rs.getString("TEMPER").trim(); 
                // 1st part of set 2 
                js22C=js11 +"_" + js22;
                js22C=(js22C.equals("")) ? "-" : js22C;
                if (!js22W.equals(js22C)) {
                    if (!js22W.equals("")) {
                        js2.append("]],");                    
                    }
                    js2.append("\"" + js22C + "\": [\"" + js22C + "\",[");                    
                    js22W=js22C;js33W="";
                }
                // 2nd part of set 2
                js33C=js22C + "_" + js33;
                js33C=(js33C.equals("")) ? "-" : js33C;
                if (!js33W.equals(js33C)) {
                    if (!js33W.equals("")) {
                        js2.append(",");
                    }
                    js2.append("[\"" + js33C + "\",\"" + js33 + "\"]"); 
                    js33W=js33C;
                } 
            }
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        js2.append("]]}");                

        // Result set 3 of 7
        rs = sp.getNextResult(); 
        try {
            js33W="";js44W="";
            js3.append("\"js3Data\":{");        	    
            while (rs.next()) {            	
                js11=rs.getString("CLASS");
                js22=rs.getString("GRADE").trim();            	
            	js33=rs.getString("TEMPER").trim();
                js44=rs.getString("SHAPE");                
                // 1st part of set 3
                js33A=js11 +"_"+ js22;
            	js33C=js11 +"_"+ js22 +"_"+ js33; 
                js33C=(js33C.equals("")) ? "-" : js33C;
                if (!js33W.equals(js33C)) {
                  if (!js33W.equals("")) {
                    js3.append("]],");                    
                  }
                  js3.append("\"" + js33C + "\": [\"" + js33C + "\",[");                    
                  js33W=js33C;js44W="";
                }
                // 2nd part of set 3
            	js44C=js11 +"_"+ js22 +"_"+ js33 + "_" + js44;  
                js44C=(js44C.equals("")) ? "-" : js44C;
                if (!js44W.equals(js44C)) {
                    if (!js44W.equals("")) {
                        js3.append(",");
                    }
                    js3.append("[\"" + js44C + "\",\"" + JSONObject.escape(rs.getString("SHDESC").trim()) + "\"]");
                    js44W=js44C;
                } 
            }
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        js3.append("]]}");                

        // Result set 4 of 7 
        rs = sp.getNextResult(); 
        try {
            js44W="";js55W="";
            js4.append("\"js4Data\":{");        	     
            while (rs.next()) {
                js11=rs.getString("CLASS");            	
                js22=rs.getString("GRADE").trim();     
                js33=rs.getString("TEMPER").trim(); 
                js44=rs.getString("SHAPE").trim();
                js55=rs.getString("SEL1").trim();
                js55D=rs.getString("SELD").trim();
                // 1st part of set 4 
            	js44A=js11 +"_"+ js22 +"_"+ js33;
            	js44C=js11 +"_"+ js22 +"_"+ js33 + "_" + js44;
                js44C=(js44C.equals("")) ? "-" : js44C;
                if (!js44W.equals(js44C)) {
                    if (!js44W.equals("")) {
                        js4.append("]],");                    
                    }
                    js4.append("\"" + js44C + "\": [\"" + js44 + "\",[");                    
                    js44W=js44C;js55W="";
                }
                // 2nd part of set 4
            	js55C=js11 +"_"+ js22 +"_"+ js33 + "_" + js44 + "_" + js55;
                js55C=(js55C.equals("")) ? "-" : js55C;
                if (!js55W.equals(js55C)) {
                    if (!js55W.equals("")) {
                        js4.append(",");
                    }
                    js4.append("[\"" + js55C + "\",\"" + js55D + "\"]"); 
                    js55W=js55C;
                }    
            }
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }        
        js4.append("]]}");

        // Result set 5 of 7
        rs = sp.getNextResult(); 
        try {
            js55W="";js66W="";
            js5.append("\"js5Data\":{");        	
            while (rs.next()) {
                if (!rs.getString("DSP4").equals("0.0000")) {
                  js66=rs.getString("DSP1") + " X " +
            		   rs.getString("DSP2") + " X " +
                       rs.getString("DSP3") + " X " +                			
            		   rs.getString("DSP4");
                } else if (!rs.getString("DSP3").equals("0.0000")) {
                  js66=rs.getString("DSP1") + " X " +
                	   rs.getString("DSP2") + " X " +
                       rs.getString("DSP3");                 	
                } else if (!rs.getString("DSP2").equals("0.0000")) {
                  js66=rs.getString("DSP1") + " X " +
                	   rs.getString("DSP2");                 	
                } else {
                  js66=rs.getString("DSP1");                	
                }
                js11=rs.getString("CLASS");            	
                js22=rs.getString("GRADE").trim();
                js33=rs.getString("TEMPER").trim(); 
                js44=rs.getString("SHAPE");                
            	js55=rs.getString("SEL1").trim();
            	wDisp=rs.getString("SEL1").trim() + "_" +
            		  rs.getString("SEL2").trim() + "_" +
            		  rs.getString("SEL3").trim() + "_" +
            		  rs.getString("SEL4").trim();
                // 1st part of set 5
            	js55C=js11 +"_"+ js22 +"_"+ js33 + "_" + js44 + "_" + js55;
                js55C=(js55C.equals("")) ? "-" : js55C;
                if (!js55W.equals(js55C)) {
                    if (!js55W.equals("")) {
                        js5.append("]],");                    
                    }
                    js5.append("\"" + js55C + "\": [\"" + js55 + "\",[");                    
                    js55W=js55C;js66W=""; 
                }
                // 2nd part of set 5
            	js66C=js55C + "_" + wDisp ;
                js66C=(js66C.equals("")) ? "-" : js66C;
                if (!js66W.equals(js66C)) {
                    if (!js66W.equals("")) {
                        js5.append(",");
                    }
                    js5.append("[\"" + js66C + "\",\"" + js66 + "\"]");  
                    js66W=js66C;
                }                   
            }
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }        
        js5.append("]]}");
        
        // Result set 6 of 7 (GRADE/SPEC)
        js22W = "";
        curType  = "";        
        rs = sp.getNextResult();       
        try {
            js6.append("\"GradeSpecs\":{");           
            while (rs.next()) {
                // Grade
            	js22=rs.getString("GRADE").trim();           
                js22=(js22.equals("")) ? "-" : js22;
                if (!js22W.equals(js22)) {
                   if (!js22W.equals("")) { 
                	   js6.append("],");
                	}
                   js6.append("\"" + js22 + "\":["); 
                   js22W = js22; curType = ""; 
                }   
                // Type
                gsType = rs.getString("GSTYPE").trim();
                gsType = (gsType.equals("")) ? "-" : gsType;
                if (!curType.equals("")) {
              	    js6.append(",");
                }
                js6.append("[\"" + gsType + "\",\"" + rs.getString("GSDESC").trim() + "\"]");
                curType = gsType;               
            }
            // GRADPSPEC data exists
            if (!js22W.equals("")) {
            	js6.append("]}");
            // Doesn't have GRADSPEC data
            } else {
            	js6.append("}");
            };
            
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Result set 7 of 7
        js77W = "";
        rs = sp.getNextResult(); 
        try {
            js7.append("\"PartNbrs\":{");        	    
            while (rs.next()) {            
              js77  = rs.getString("PART").trim();
              js77U = rs.getString("QTYUOM").trim();
              if (!js77W.equals(js77)) {
                  if (!js77W.equals("")) { 
               	   js7.append("],");
               	}
                  js7.append("\"" + js77 + "_" + js77U + "\":[");
               	  js7.append("[\"" + js77 + "\"]");            	  
                  js77W = js77; 
               }
            }
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (!js77W.equals("")) {
          js7.append("]}");
        } else {
          js7.append("}");
        }
        
        return "{" + js1.toString() + "," + js2.toString() + "," + js3.toString() +  "," + js4.toString() + "," + js5.toString() + "," + js6.toString() + "," + js7.toString() + "}";
    }
    
    public String getProdSel02JSON(String cdist, String ccust, String usrid) { 
        StringBuilder js1 = new StringBuilder();    	
        StringBuilder js2 = new StringBuilder();
        StringBuilder js3 = new StringBuilder();
        StringBuilder js4 = new StringBuilder();
        StringBuilder js5 = new StringBuilder();
        StringBuilder js6 = new StringBuilder();
        StringBuilder js7 = new StringBuilder();
        StringBuilder js8 = new StringBuilder();
        StringBuilder js9 = new StringBuilder();
        StringBuilder jsA = new StringBuilder();
        String key01  ="";String key01W="";
        String key02  ="";String key02W="";
        String sel02  ="";String sel02W="";
        String dsc02  ="";
          
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODSEL02");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
        sp.setParm("CDIST", cdist);
        sp.setParm("CCUST", ccust);
        sp.setParm("USRID", usrid);
        
        // Result set 1 of   
        ResultSet rs = sp.executeQuery();
        try {
            key01W="";
            js1.append("\"js1Data\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("key01").trim());
              dsc02=JSONObject.escape(rs.getString("dsc01").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js1.append("]],");
                }
           	    js1.append("\"" + key01 + "\":[\"" + dsc02 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!sel02W.equals("")) {
                  js1.append(",");
                }
                js1.append("[\"" + key02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js1.append("]]}");
            } else {
            	js1.append("}");
            }
            rs.close();
         } catch (Exception e) {
         	 js1.append("}");
             e.printStackTrace();
         } 
               
        // Result set 2 of   
        rs = sp.getNextResult(); 
        try {
             key01W="";key02W="";
             js2.append("\"js2Data\":{");        	    
             while (rs.next()) {            	
               key01=JSONObject.escape(rs.getString("key01").trim());  
               sel02=JSONObject.escape(rs.getString("sel02").trim());
               dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
               // 1st part           
               if (!key01W.equals(key01)) { 
                 if (!key01W.equals("")) {
                   js2.append("]],");
                 }
            	 js2.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                 key01W=key01;key02W="";
               }
               // 2nd part
               key02=key01W +"_" + sel02;
               if (!key02W.equals(key02)) {
                 if (!key02W.equals("")) {
                   js2.append(",");
                 }
                 js2.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                 key02W=key02;
               }
             }
          // Check for data
          if (!key01W.equals("")) {
          	js2.append("]]}");
          } else {
           	js2.append("}");
          }
          rs.close();
        } catch (Exception e) {
           js2.append("}");
           e.printStackTrace();
        }
        
        // Result set 3 
        rs = sp.getNextResult(); 
        try {
            key01W="";key02W="";
            js3.append("\"js3Data\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim());
              sel02=JSONObject.escape(rs.getString("sel02").trim());
              dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js3.append("]],");
                }
           	    js3.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=key01W +"_" + sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js3.append(",");
                }
                js3.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js3.append("]]}");
            } else {
            	js3.append("}");
            }
            rs.close();

        } catch (Exception e) {
        	js3.append("}");
            e.printStackTrace();
        }
        
        // Result set 4 
        rs = sp.getNextResult(); 
        try {
            key01W="";key02W="";
            js4.append("\"js4Data\":{");   
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim() + "_" + rs.getString("key03").trim());
              
              sel02=JSONObject.escape(rs.getString("sel02").trim());
              dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js4.append("]],");
                }
           	    js4.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=key01W +"_"+sel02;
              
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js4.append(",");
                } 
                js4.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                    
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js4.append("]]}");
            } else {
            	js4.append("}");
            }
            rs.close();
        } catch (Exception e) {
        	js4.append("}");
            e.printStackTrace();
        }
        
        // Result set 5 
        rs = sp.getNextResult(); 
        try {
            key01W="";key02W="";
            js5.append("\"js5Data\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim() + "_" + rs.getString("key03").trim() + "_" + rs.getString("key04").trim());
              sel02=JSONObject.escape(rs.getString("sel02").trim());
              dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js5.append("]],");
                }
           	    js5.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=key01W +"_" + sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js5.append(",");
                }
                js5.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js5.append("]]}");
            } else {
            	js5.append("}");
            }
            rs.close();
        } catch (Exception e) {
        	js5.append("}");
            e.printStackTrace();
        }
                
        // Result set 6 
        rs = sp.getNextResult(); 
        try {
            key01W="";key02W="";
            js6.append("\"js6Data\":{");        	    
            while (rs.next()) {            	
                key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim() + "_" + rs.getString("key03").trim()  + "_" + rs.getString("key04").trim() + "_" + rs.getString("key05").trim());
                sel02=JSONObject.escape(rs.getString("sel1").trim() + "_" + rs.getString("sel2").trim() + "_" + rs.getString("sel3").trim() + "_" + rs.getString("sel4").trim());
                if (!rs.getString("DSP4").equals("0.0000")) {       
              	  dsc02=rs.getString("DSP1") + " X " +               
              	        rs.getString("DSP2") + " X " +                     
              	        rs.getString("DSP3") + " X " +               
              	        rs.getString("DSP4");                              
              	} else if (!rs.getString("DSP3").equals("0.0000")) {
              	  dsc02=rs.getString("DSP1") + " X " +               
              	        rs.getString("DSP2") + " X " +                  
              	        rs.getString("DSP3");                        
              	} else if (!rs.getString("DSP2").equals("0.0000")) {
              	  dsc02=rs.getString("DSP1") + " X " +               
              	        rs.getString("DSP2");                           
              	} else {                                            
              	  dsc02=rs.getString("DSP1").trim();                   
              	} 

                // 1st part           
                if (!key01W.equals(key01)) { 
                  if (!key01W.equals("")) {
                    js6.append("]],");
                  }
             	    js6.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                  key01W=key01;key02W="";
                }
                // 2nd part
                key02=key01W +"_" + sel02;
                if (!key02W.equals(key02)) {
                  if (!key02W.equals("")) {
                    js6.append(",");
                  }
                  js6.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                  key02W=key02;
                }
              }
              // Check for data
              if (!key01W.equals("")) {
              	js6.append("]]}");
              } else {
              	js6.append("}");
              }
              rs.close();
          } catch (Exception e) {
        	 js6.append("}"); 
             e.printStackTrace();
          }  
        
        // Result set 7           
        rs = sp.getNextResult();
        try {
        	key01W="";key02W="";
            js7.append("\"GradeSpecs\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("sel02").trim());
              dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js7.append("]],");
                }
                js7.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=key01W +"_" + sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js7.append(",");
                }
                js7.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                key02W=key02;
              }
            }
        // Check for data
        if (!key01W.equals("")) {
        	js7.append("]]}");
        } else {
           	js7.append("}");
        }
        rs.close();
        } catch (Exception e) {
           	js7.append("}");
            e.printStackTrace();
        }
        
        // Result set 8  
        rs = sp.getNextResult();
        try {
            key01W="";
            js8.append("\"PartNbrs\":{");         	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("sel01").trim());
              dsc02=JSONObject.escape(rs.getString("sel02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js8.append("]],");
                }
           	    js8.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js8.append(",");
                }
                js8.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                      
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js8.append("]]}");
            } else {
            	js8.append("}");
            }             
            rs.close();
        } catch (Exception e) {
        	js8.append("}");
            e.printStackTrace();
        }
        
        // Result set 9  
        rs = sp.getNextResult();
        try {
            key01W="";
            js9.append("\"QtyUom\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("sel01").trim());
              dsc02=JSONObject.escape(rs.getString("sel02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js9.append("]],");
                }
           	    js9.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js9.append(",");
                }
                js9.append("[\"" + key02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js9.append("]]}");
            } else {
            	js9.append("}");
            }
            rs.close();
        } catch (Exception e) {
        	js9.append("}");	
           e.printStackTrace();
        }
      
        // Result set A  
        rs = sp.getNextResult();
        try {
            key01W="";
            jsA.append("\"DailyItems\":{");         	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim()); 
              sel02=JSONObject.escape(rs.getString("sel01").trim()); 
              dsc02=JSONObject.escape(rs.getString("sel01").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  jsA.append("]],");
                }
           	    jsA.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  jsA.append(",");
                }
                jsA.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                      
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	jsA.append("]]}");
            } else {
            	jsA.append("}");
            }             
            rs.close();
        } catch (Exception e) {
        	jsA.append("}");
            e.printStackTrace();
        }        
        
        // Results used in getOEJSON (function.js)        
        return "{" + js1.toString() + "," + js2.toString() + "," + js3.toString() +  "," + js4.toString() + "," + js5.toString() + "," + js6.toString() + "," + js7.toString() + "," + js8.toString() + "," + js9.toString() + "," + jsA.toString() + "}";
    }
         
    public String getProdSel03JSON(String cdist, String ccust, String userid) { 
        StringBuilder js1 = new StringBuilder();    	
        StringBuilder js2 = new StringBuilder();
        StringBuilder js3 = new StringBuilder();
        StringBuilder js4 = new StringBuilder();
        StringBuilder js5 = new StringBuilder();
        StringBuilder js6 = new StringBuilder();
        StringBuilder js7 = new StringBuilder();
        StringBuilder js8 = new StringBuilder();
        StringBuilder js9 = new StringBuilder();
        String key01  ="";String key01W="";
        String key02  ="";String key02W="";
        String sel02  ="";String sel02W="";
        String dsc02  ="";

            
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODSEL03");
        sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
        sp.setParm("CDIST", cdist);
        sp.setParm("CCUST", ccust);
        sp.setParm("USRID", userid);
        
        // Result set 1 of   
        ResultSet rs = sp.executeQuery();
        try {
            key01W="";
            js1.append("\"js1Data\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("key01").trim());
              dsc02=JSONObject.escape(rs.getString("dsc01").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js1.append("]],");
                }
           	    js1.append("\"" + key01 + "\":[\"" + dsc02 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!sel02W.equals("")) {
                  js1.append(",");
                }
                js1.append("[\"" + key02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js1.append("]]}");
            } else {
            	js1.append("}");
            }
            rs.close();
         } catch (Exception e) {
        	 js1.append("}");
             e.printStackTrace();
         } 
               
        // Result set 2 of   
        rs = sp.getNextResult(); 
        try {
             key01W="";key02W="";
             js2.append("\"js2Data\":{");        	    
             while (rs.next()) {            	
               key01=JSONObject.escape(rs.getString("key01").trim());  
               sel02=JSONObject.escape(rs.getString("sel02").trim());
               dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
               // 1st part           
               if (!key01W.equals(key01)) { 
                 if (!key01W.equals("")) {
                   js2.append("]],");
                 }
            	 js2.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                 key01W=key01;key02W="";
               }
               // 2nd part
               key02=key01W +"_" + sel02;
               if (!key02W.equals(key02)) {
                 if (!key02W.equals("")) {
                   js2.append(",");
                 }
                 js2.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                 key02W=key02;
               }
             }
          // Check for data
          if (!key01W.equals("")) {
          	js2.append("]]}");
          } else {
           	js2.append("}");
          }
          rs.close();
        } catch (Exception e) {
        	js2.append("}");
           e.printStackTrace();
        }
        
        // Result set 3 
        rs = sp.getNextResult(); 
        try {
            key01W="";key02W="";
            js3.append("\"js3Data\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim());
              sel02=JSONObject.escape(rs.getString("sel02").trim());
              dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js3.append("]],");
                }
           	    js3.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=key01W +"_" + sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js3.append(",");
                }
                js3.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js3.append("]]}");
            } else {
            	js3.append("}");
            }
            rs.close();
        } catch (Exception e) {
        	js3.append("}");
            e.printStackTrace();
        }
        
        // Result set 4 
        rs = sp.getNextResult(); 
        try {
            key01W="";key02W="";
            js4.append("\"js4Data\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim() + "_" + rs.getString("key03").trim());
              sel02=JSONObject.escape(rs.getString("sel02").trim());
              dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js4.append("]],");
                }
           	    js4.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=key01W +"_" + sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js4.append(",");
                }
                js4.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js4.append("]]}");
            } else {
            	js4.append("}");
            }
            rs.close();
             
                
              File myObj = new File("/home/BEICHHORN/JF.txt");
              myObj.createNewFile();
              BufferedWriter writer = new BufferedWriter(new FileWriter("/home/BEICHHORN/JF.txt", true));
              writer.write(key01);
              writer.newLine();
              writer.write(sel02);
              writer.newLine();
              writer.write(dsc02);
              writer.newLine();
              writer.close();
        } catch (Exception e) {
        	js4.append("}");
            e.printStackTrace();
        }
        
        // Result set 5 
        rs = sp.getNextResult(); 
        try {
            key01W="";key02W="";
            js5.append("\"js5Data\":{");        	    
            while (rs.next()) {            	
                key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim()+ "_" + rs.getString("key03").trim() + "_" + rs.getString("key04").trim());
                sel02=JSONObject.escape(rs.getString("sel1").trim() + "_" + rs.getString("sel2").trim() + "_" + rs.getString("sel3").trim() + "_" + rs.getString("sel4").trim());
                if (!rs.getString("DSP4").equals("0.0000")) {       
              	  dsc02=rs.getString("DSP1") + " X " +               
              	        rs.getString("DSP2") + " X " +                     
              	        rs.getString("DSP3") + " X " +               
              	        rs.getString("DSP4");                              
              	} else if (!rs.getString("DSP3").equals("0.0000")) {
              	  dsc02=rs.getString("DSP1") + " X " +               
              	        rs.getString("DSP2") + " X " +                  
              	        rs.getString("DSP3");                        
              	} else if (!rs.getString("DSP2").equals("0.0000")) {
              	  dsc02=rs.getString("DSP1") + " X " +               
              	        rs.getString("DSP2");                           
              	} else {                                            
              	  dsc02=rs.getString("DSP1").trim();                   
              	}                                                   
                // 1st part           
                if (!key01W.equals(key01)) { 
                  if (!key01W.equals("")) {
                    js5.append("]],");
                  }
             	    js5.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                  key01W=key01;key02W="";
                }
                // 2nd part
                key02=key01W +"_" + sel02;
                if (!key02W.equals(key02)) {
                  if (!key02W.equals("")) {
                    js5.append(",");
                  }
                  js5.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                  key02W=key02;
                }
              }
              // Check for data
              if (!key01W.equals("")) {
              	js5.append("]]}");
              } else {
              	js5.append("}");
              }
              rs.close();
          } catch (Exception e) {
        	 js5.append("}");
             e.printStackTrace();
          }  
        
        // Result set 6           
        rs = sp.getNextResult();
        try {
            key01W="";
            js6.append("\"GradeSpecs\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("sel02").trim());
              dsc02=JSONObject.escape(rs.getString("sel02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js6.append("]],");
                }
           	    js6.append("\"" + key01 + "\":[\"" + dsc02 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js6.append(",");
                }
                js6.append("[\"" + key02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js6.append("]]}");
            } else {
            	js6.append("}");
            }
            rs.close();
        } catch (Exception e) {
        	js6.append("}");
            e.printStackTrace();
        }
        
        // Result set 7  
        rs = sp.getNextResult();
        try {
            key01W="";
            js7.append("\"PartNbrs\":{");         	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("sel01").trim());
              dsc02=JSONObject.escape(rs.getString("sel02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js7.append("]],");
                }
           	    js7.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js7.append(",");
                }
                js7.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                      
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js7.append("]]}");
            } else {
            	js7.append("}");
            }             
            rs.close();
        } catch (Exception e) {
        	js7.append("}");
            e.printStackTrace();
        }
        
        // Result set 8    
        rs = sp.getNextResult();
        try {
            key01W="";
            js8.append("\"QtyUom\":{");        	    
            while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim());  
              sel02=JSONObject.escape(rs.getString("sel01").trim());
              dsc02=JSONObject.escape(rs.getString("sel02").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js8.append("]],");
                }
           	    js8.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js8.append(",");
                }
                js8.append("[\"" + key02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js8.append("]]}");
            } else {
            	js8.append("}");
            }
            rs.close();
        } catch (Exception e) {
        	js8.append("}");
           e.printStackTrace();
        }     
        
        // Result set 9  
        rs = sp.getNextResult();
        try {
            key01W="";
            js9.append("\"DailyItems\":{");         	    
            while (rs.next()) {            	
                key01=JSONObject.escape(rs.getString("key01").trim()); 
                sel02=JSONObject.escape(rs.getString("sel01").trim()); 
                dsc02=JSONObject.escape(rs.getString("sel01").trim()); 
              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js9.append("]],");
                }
           	    js9.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js9.append(",");
                }
                js9.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                      
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
            	js9.append("]]}");
            } else {
            	js9.append("}");
            }             
            rs.close();
        } catch (Exception e) {
        	js9.append("}");
            e.printStackTrace();
        }
        
        // Results used in getOEJSON (function.js)
        return "{" + js1.toString() + "," + js2.toString() + "," + js3.toString() +  "," + js4.toString() + "," + js5.toString() + "," + js6.toString() + "," + js7.toString() + "," + js8.toString() + "," + js9.toString() + "}";
    }
    
    public String getProdSel04JSON(String cdist, String ccust, String userid) { 
      
      StringBuilder js1 = new StringBuilder();    	
      StringBuilder js2 = new StringBuilder();
      StringBuilder js3 = new StringBuilder();
      StringBuilder js4 = new StringBuilder();
      StringBuilder js5 = new StringBuilder();
      StringBuilder js6 = new StringBuilder();
      StringBuilder js7 = new StringBuilder();
      StringBuilder js8 = new StringBuilder();
      StringBuilder js9 = new StringBuilder();
      StringBuilder jsA = new StringBuilder();
      String key01  ="";String key01W="";
      String key02  ="";String key02W="";
      String sel02  ="";String sel02W="";
      String dsc02  ="";
      String sel04  ="";String sel04W="";
      String dsc04  ="";
        
      DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETPRODSEL04");
      sp.setParm("LIBNAME", Globals.getSysProp("tblLibrary")); 
      sp.setParm("CDIST", cdist);
      sp.setParm("CCUST", ccust);
      sp.setParm("USRID", userid);
      
      // Result set 1 of   
      ResultSet rs = sp.executeQuery();
      try {
          key01W="";
          js1.append("\"js1Data\":{");        	    
          while (rs.next()) {            	
            key01=JSONObject.escape(rs.getString("key01").trim());  
            sel02=JSONObject.escape(rs.getString("key01").trim());
            dsc02=JSONObject.escape(rs.getString("dsc01").trim()); 
            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                js1.append("]],");
              }
               js1.append("\"" + key01 + "\":[\"" + dsc02 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=sel02;
            if (!key02W.equals(key02)) {
              if (!sel02W.equals("")) {
                js1.append(",");
              }
              js1.append("[\"" + key02 + "\"]");                     
              key02W=key02;
            }
          }
          // Check for data
          if (!key01W.equals("")) {
            js1.append("]]}");
          } else {
            js1.append("}");
          }
          rs.close();
       } catch (Exception e) {
          js1.append("}");
           e.printStackTrace();
       } 
             
      // Result set 2 of   
      rs = sp.getNextResult(); 
      try {
           key01W="";key02W="";
           js2.append("\"js2Data\":{");        	    
           while (rs.next()) {            	
             key01=JSONObject.escape(rs.getString("key01").trim());  
             sel02=JSONObject.escape(rs.getString("sel02").trim());
             dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
             // 1st part           
             if (!key01W.equals(key01)) { 
               if (!key01W.equals("")) {
                 js2.append("]],");
               }
             js2.append("\"" + key01 + "\":[\"" + key01 + "\",[");
               key01W=key01;key02W="";
             }
             // 2nd part
             key02=key01W +"_" + sel02;
             if (!key02W.equals(key02)) {
               if (!key02W.equals("")) {
                 js2.append(",");
               }
               js2.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
               key02W=key02;
             }
           }
        // Check for data
        if (!key01W.equals("")) {
          js2.append("]]}");
        } else {
           js2.append("}");
        }
        rs.close();
      } catch (Exception e) {
         js2.append("}");
         e.printStackTrace();
      }
      
      // Result set 3 
      rs = sp.getNextResult(); 
      try {
          key01W="";key02W="";
          js3.append("\"js3Data\":{");        	    
          while (rs.next()) {            	
            key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim());
            sel02=JSONObject.escape(rs.getString("sel02").trim());
            dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                js3.append("]],");
              }
               js3.append("\"" + key01 + "\":[\"" + key01 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=key01W +"_" + sel02;
            if (!key02W.equals(key02)) {
              if (!key02W.equals("")) {
                js3.append(",");
              }
              js3.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
              key02W=key02;
            }
          }
          // Check for data
          if (!key01W.equals("")) {
            js3.append("]]}");
          } else {
            js3.append("}");
          }
          rs.close();

      } catch (Exception e) {
        js3.append("}");
          e.printStackTrace();
      }
      
      // Result set 4 
      rs = sp.getNextResult(); 
      try {
        
          key01W="";key02W="";
          js4.append("\"js4Data\":{"); 

          while (rs.next()) { 
            key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim() + "_" + rs.getString("key03").trim());
            sel04=JSONObject.escape(rs.getString("sel04").trim());
            dsc04=JSONObject.escape(rs.getString("dsc04").trim()); 

            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                js4.append("]],");
              }
               js4.append("\"" + key01 + "\":[\"" + key01 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=key01W +"_"+sel04;
            
            if (!key02W.equals(key02)) {
              if (!key02W.equals("")) {
                js4.append(",");
              } 
              js4.append("[\"" + key02 + "\",\"" + dsc04 + "\"]");                    
              key02W=key02;
            }

          }
          // Check for data
          if (!key01W.equals("")) {
            js4.append("]]}");
          } else {
            js4.append("}");
          }
          rs.close();

      } catch (Exception e) {
        js4.append("}");
          e.printStackTrace();
      }
            
      
      // Result set 5 
      rs = sp.getNextResult(); 
      try {
          key01W="";key02W="";
          js5.append("\"js5Data\":{");        	    
          while (rs.next()) {            	
            key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim() + "_" + rs.getString("key03").trim() + "_" + rs.getString("key04").trim());
            sel02=JSONObject.escape(rs.getString("sel02").trim());
            dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                js5.append("]],");
              }
               js5.append("\"" + key01 + "\":[\"" + key01 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=key01W +"_" + sel02;
            if (!key02W.equals(key02)) {
              if (!key02W.equals("")) {
                js5.append(",");
              }
              js5.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
              key02W=key02;
            }
          }
          // Check for data
          if (!key01W.equals("")) {
            js5.append("]]}");
          } else {
            js5.append("}");
          }
          rs.close();
      } catch (Exception e) {
        js5.append("}");
          e.printStackTrace();
      }
              
      // Result set 6 
      rs = sp.getNextResult(); 
      try {
          key01W="";key02W="";
          js6.append("\"js6Data\":{");        	    
          while (rs.next()) {            	
              key01=JSONObject.escape(rs.getString("key01").trim() + "_" + rs.getString("key02").trim() + "_" + rs.getString("key03").trim()  + "_" + rs.getString("key04").trim() + "_" + rs.getString("key05").trim());
              sel02=JSONObject.escape(rs.getString("sel1").trim() + "_" + rs.getString("sel2").trim() + "_" + rs.getString("sel3").trim() + "_" + rs.getString("sel4").trim());
              if (!rs.getString("DSP4").equals("0.0000")) {       
                dsc02=rs.getString("DSP1") + " X " +               
                      rs.getString("DSP2") + " X " +                     
                      rs.getString("DSP3") + " X " +               
                      rs.getString("DSP4");                              
              } else if (!rs.getString("DSP3").equals("0.0000")) {
                dsc02=rs.getString("DSP1") + " X " +               
                      rs.getString("DSP2") + " X " +                  
                      rs.getString("DSP3");                        
              } else if (!rs.getString("DSP2").equals("0.0000")) {
                dsc02=rs.getString("DSP1") + " X " +               
                      rs.getString("DSP2");                           
              } else {                                            
                dsc02=rs.getString("DSP1").trim();                   
              }  

              File myObj = new File("/home/BEICHHORN/JF.txt");
              myObj.createNewFile();
              BufferedWriter writer = new BufferedWriter(new FileWriter("/home/BEICHHORN/JF.txt", true));
              writer.write(key01);
              writer.newLine();
              writer.write(sel02);
              writer.newLine();
              writer.write(dsc02);
              writer.newLine();
              writer.close();

              // 1st part           
              if (!key01W.equals(key01)) { 
                if (!key01W.equals("")) {
                  js6.append("]],");
                }
                 js6.append("\"" + key01 + "\":[\"" + key01 + "\",[");
                key01W=key01;key02W="";
              }
              // 2nd part
              key02=key01W +"_" + sel02;
              if (!key02W.equals(key02)) {
                if (!key02W.equals("")) {
                  js6.append(",");
                }
                js6.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
                key02W=key02;
              }
            }
            // Check for data
            if (!key01W.equals("")) {
              js6.append("]]}");
            } else {
              js6.append("}");
            }
            rs.close();
        } catch (Exception e) {
         js6.append("}"); 
           e.printStackTrace();
        } 
        
        
      
      // Result set 7           
      rs = sp.getNextResult();
      try {
        key01W="";key02W="";
          js7.append("\"GradeSpecs\":{");        	    
          while (rs.next()) {            	
            key01=JSONObject.escape(rs.getString("key01").trim());  
            sel02=JSONObject.escape(rs.getString("sel02").trim());
            dsc02=JSONObject.escape(rs.getString("dsc02").trim()); 
            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                js7.append("]],");
              }
              js7.append("\"" + key01 + "\":[\"" + key01 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=key01W +"_" + sel02;
            if (!key02W.equals(key02)) {
              if (!key02W.equals("")) {
                js7.append(",");
              }
              js7.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                     
              key02W=key02;
            }
          }
      // Check for data
      if (!key01W.equals("")) {
        js7.append("]]}");
      } else {
           js7.append("}");
      }
      rs.close();
      } catch (Exception e) {
           js7.append("}");
          e.printStackTrace();
      }
      
      // Result set 8  
      rs = sp.getNextResult();
      try {
          key01W="";
          js8.append("\"PartNbrs\":{");         	    
          while (rs.next()) {            	
            key01=JSONObject.escape(rs.getString("key01").trim());  
            sel02=JSONObject.escape(rs.getString("sel01").trim());
            dsc02=JSONObject.escape(rs.getString("sel02").trim()); 
            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                js8.append("]],");
              }
               js8.append("\"" + key01 + "\":[\"" + key01 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=sel02;
            if (!key02W.equals(key02)) {
              if (!key02W.equals("")) {
                js8.append(",");
              }
              js8.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                      
              key02W=key02;
            }
          }
          // Check for data
          if (!key01W.equals("")) {
            js8.append("]]}");
          } else {
            js8.append("}");
          }             
          rs.close();
      } catch (Exception e) {
        js8.append("}");
          e.printStackTrace();
      }
      
      // Result set 9  
      rs = sp.getNextResult();
      try {
          key01W="";
          js9.append("\"QtyUom\":{");        	    
          while (rs.next()) {            	
            key01=JSONObject.escape(rs.getString("key01").trim());  
            sel02=JSONObject.escape(rs.getString("sel01").trim());
            dsc02=JSONObject.escape(rs.getString("sel02").trim()); 
            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                js9.append("]],");
              }
               js9.append("\"" + key01 + "\":[\"" + key01 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=sel02;
            if (!key02W.equals(key02)) {
              if (!key02W.equals("")) {
                js9.append(",");
              }
              js9.append("[\"" + key02 + "\"]");                     
              key02W=key02;
            }
          }
          // Check for data
          if (!key01W.equals("")) {
            js9.append("]]}");
          } else {
            js9.append("}");
          }
          rs.close();
      } catch (Exception e) {
        js9.append("}");	
         e.printStackTrace();
      }
    
      // Result set A  
      rs = sp.getNextResult();
      try {
          key01W="";
          jsA.append("\"DailyItems\":{");         	    
          while (rs.next()) {            	
            key01=JSONObject.escape(rs.getString("key01").trim()); 
            sel02=JSONObject.escape(rs.getString("sel01").trim()); 
            dsc02=JSONObject.escape(rs.getString("sel01").trim()); 
            // 1st part           
            if (!key01W.equals(key01)) { 
              if (!key01W.equals("")) {
                jsA.append("]],");
              }
               jsA.append("\"" + key01 + "\":[\"" + key01 + "\",[");
              key01W=key01;key02W="";
            }
            // 2nd part
            key02=sel02;
            if (!key02W.equals(key02)) {
              if (!key02W.equals("")) {
                jsA.append(",");
              }
              jsA.append("[\"" + key02 + "\",\"" + dsc02 + "\"]");                      
              key02W=key02;
            }
          }
          // Check for data
          if (!key01W.equals("")) {
            jsA.append("]]}");
          } else {
            jsA.append("}");
          }             
          rs.close();
      } catch (Exception e) {
        jsA.append("}");
          e.printStackTrace();
      }        
      
      // Results used in getOEJSON (function.js)        
      return "{" + js1.toString() + "," + js2.toString() + "," + js3.toString() +  "," + js4.toString() + "," + js5.toString() + "," + js6.toString() + "," + js7.toString() + "," + js8.toString() + "," + js9.toString() + "," + jsA.toString() + "}";
  }
    public ArrayList getShipToPickItems() {
        String tableLib = Globals.getSysProp("tblLibrary");  
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETSHIPADDR");
        sp.setParm("LIBNAME", tableLib);
        sp.setParm("DISTRICT", this.district);
        sp.setParm("CUSTNUM", this.custnum);
        sp.setParm("SEQID", "");
        ResultSet rs = sp.executeQuery();   
        return sp.getResultSetMapArray();
    }
    
    public String getJSONShipDates(String District, String Route) {
        String json = "";
        int recs = 0;
        String tableLib = Globals.getSysProp("tblLibrary");  
        DB2storedproc sp = new DB2storedproc(db2con.getCon(), Globals.getSysProp("spLibrary") + ".GETSHIPDATES");
        sp.setParm("LIBNAME", tableLib);
        sp.setParm("DISTRICT", District);
        sp.setParm("ROUTENO", Route);
        ResultSet rs = sp.executeQuery();
         try {
            json = "[";  
            
            while (rs.next()) {
                json += (recs>0)? "," : "";
                json += "{\"date\":\"" + rs.getString("SHIPDATE") + "\",\"wkday\":\"" + rs.getString("WEEKDAY") + "\"}" ;
                recs++;
            }
            
            rs.close();
            json += "]";
         } catch (Exception e) {
            e.printStackTrace();
        }
 
        return json;
    }
}
