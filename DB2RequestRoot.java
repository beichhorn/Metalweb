/*
 * DB2RequestRoot.java
 *
 * Created on August 24, 2007, 3:44 PM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.paragon.db2;
import java.io.*;
import java.util.*;
import java.sql.*;
import org.w3c.dom.*;
import javax.xml.parsers.*;
import javax.xml.transform.*;
import javax.xml.transform.stream.*;
import javax.xml.transform.dom.*;
import org.apache.commons.lang.StringEscapeUtils;
import org.json.simple.JSONObject;

/**
 *
 * @author osolis
 */
public class DB2RequestRoot {
    Connection con = null;
    ResultSet rs = null;
    ResultSetMetaData mdata = null;
    boolean ShowXMLDeclaration = false;
        
    DB2RequestRoot() { }
    
     public HashMap getRowMap(ResultSet rs) {
        HashMap hm = new HashMap();
        String colName = "";
        Object obj = null;
        try {
            for(int i = 1; i <= mdata.getColumnCount(); i++) {
                colName = mdata.getColumnLabel(i); 
                obj = rs.getObject(colName);
                if (obj.getClass() == java.lang.String.class) 
                   hm.put(colName, ((String)obj).trim()); 
                else   
                    hm.put(colName, obj); 
                
            }
        } catch (Exception e){
            hm = null;
        }
        return hm;
    }
     
    public ArrayList getResultSetMapArray() {
        ArrayList a = new ArrayList();    
        try {
            while (rs.next()) {
                a.add(getRowMap(rs));
            }    
        } catch (Exception e) {
            e.printStackTrace();
        }
        return a;
    } 
     
    public String getRowXML() {
        
        String colName = "";
        try {
            for(int i = 1; i <= mdata.getColumnCount(); i++) {
                colName = mdata.getColumnLabel(i); 
                
               //m.put(colName, rs.getObject(colName)); 
                
            }
        } catch (Exception e){
           
        }
        
       return "";
    }
    
    public ResultSet getResultSet() {
        return rs;
    }
    public ResultSetMetaData getResultMetaData() {
        return mdata;
    }
    
     public String getResultSetXMLNoDec() {
         ShowXMLDeclaration = false;
         String xml = getResultSetXML();
         ShowXMLDeclaration = true;      
         return xml;
     }
    
    public String getResultSetXML() {
        String colName = "";
        long recCnt = 0;
        boolean rowOK = false;
        try {
            DocumentBuilder docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            org.w3c.dom.Document doc = docBuilder.newDocument();	 
            Element parentNode = doc.createElement("DB2RecSet");
            //rs.beforeFirst();
            //if (rs.isBeforeFirst()) 
            rowOK = rs.next();
                    
            while (rowOK) {  
                   Element recNode = doc.createElement("DB2Rec");
                    
                    for(int i = 1; i <= mdata.getColumnCount(); i++) {
                        colName = mdata.getColumnLabel(i);
                        Element colNode = doc.createElement(colName); 
                        String colValue = rs.getString(colName);
                        if (colValue == null) colValue = "";
                        Text colText = doc.createTextNode(colValue.trim());
                        colNode.appendChild(colText);
                        recNode.appendChild(colNode);   
                    }    
                parentNode.appendChild(recNode);
                recCnt++;
                rowOK = rs.next();
            }           
            //return getDOMAsXml(doc);
            parentNode.setAttribute("reccnt", String.valueOf(recCnt));
            return xmlToString(parentNode, ShowXMLDeclaration);
        } catch (Exception e) {
           e.printStackTrace(); 
        }
        return ""; 
    }
    
    public String getResultSetJSON() {
        String colName = "";
        long recCnt = 0;
        boolean rowOK = false;
        StringBuilder json = new StringBuilder();
        
        try {
            //DocumentBuilder docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            //org.w3c.dom.Document doc = docBuilder.newDocument();	 
            //Element parentNode = doc.createElement("DB2RecSet");
            json.append("[");
            while (rs != null && rs.next()) {  
                   //Element recNode = doc.createElement("DB2Rec");
                    if (recCnt>0) json.append(",");
                    json.append("{");
                    for(int i = 1; i <= mdata.getColumnCount(); i++) {
                        colName = mdata.getColumnLabel(i);
                        //Element colNode = doc.createElement(colName); 
                        if (i>1) json.append(",");
                        json.append("\""+colName+"\":");
                        
                        String colValue = StringEscapeUtils.escapeJavaScript(rs.getString(colName).trim());
                        if (colValue == null) colValue = "";
                        json.append("\""+ JSONObject.escape(colValue) + "\"");
                        
                        //Text colText = doc.createTextNode(colValue.trim());
                        //colNode.appendChild(colText);
                        //recNode.appendChild(colNode);   
                    }    
                    json.append("}");
                //parentNode.appendChild(recNode);
                if (recCnt++ > 100) break;
                
            }           
            json.append("]");
            //return getDOMAsXml(doc);
            //parentNode.setAttribute("reccnt", String.valueOf(recCnt));
            //return xmlToString(parentNode, ShowXMLDeclaration);
            return json.toString();
        } catch (Exception e) {
           e.printStackTrace(); 
        }
        return ""; 
    }

    public String getHashMapJSON(HashMap map) {
        StringBuilder json = new StringBuilder();
        String delim = "";
        json.append("{");
        Iterator it = map.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry pairs = (Map.Entry)it.next();
            json.append(delim);
            json.append("\"" + pairs.getKey() + "\":\"" + pairs.getValue() + "\"");
            delim = ",";
        }
        json.append("}");
        return json.toString();
    }
        
        
    /*
     public String getDOMAsXml(Document doc) throws TransformerConfigurationException, TransformerException {
        DOMSource domSource = new DOMSource(doc);
        TransformerFactory tf = TransformerFactory.newInstance();
        Transformer transformer = tf.newTransformer();
        //transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION,"yes");
        transformer.setOutputProperty(OutputKeys.METHOD, "xml");
        transformer.setOutputProperty(OutputKeys.ENCODING,"ISO-8859-1");
        //transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");
        //transformer.setOutputProperty(OutputKeys.INDENT, "yes");
        java.io.StringWriter sw = new java.io.StringWriter();
        StreamResult sr = new StreamResult(sw);
        transformer.transform(domSource, sr);
        return sw.toString();
    }
    */

      public static String xmlToString(Node node, boolean ShowDeclaration) {
        try {
            Source source = new DOMSource(node);
            StringWriter stringWriter = new StringWriter();
            Result result = new StreamResult(stringWriter);
            TransformerFactory factory = TransformerFactory.newInstance();
            Transformer transformer = factory.newTransformer();
            if (!ShowDeclaration)
                transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION,"yes");
            
            transformer.transform(source, result);
            return stringWriter.getBuffer().toString();
        } catch (TransformerConfigurationException e) {
            e.printStackTrace();
        } catch (TransformerException e) {
            e.printStackTrace();
        }
        return null;
    }
     
}
