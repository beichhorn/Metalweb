/*
 * DB2storedproc.java
 *
 * Created on August 17, 2007, 10:19 AM
 *
 * To change this template, choose Tools | Template Manager
 * and open the template in the editor.
 */

package com.paragon.db2;
import java.util.*;
import java.sql.*;
import java.io.Serializable;
import java.io.*;
import java.lang.reflect.*;

/**
 *
 * @author osolis
 */
public class DB2storedproc extends DB2RequestRoot {
    CallableStatement stmt = null;
    String procName = "";
    LinkedHashMap Parms = new LinkedHashMap();
    
    class spParm {
       String parmName = ""; 
       Object parm;
       Method setmethod; 
       public spParm(String pName, Object Parm, Method method) {
            this.parmName = pName;
            this.parm = Parm;
            this.setmethod = method;
       }
    }
    
    /** Creates a new instance of DB2storedproc */
    public DB2storedproc(Connection Con, String ProcName) {
        this.con = Con;
        String proc = ProcName;

        if (proc.indexOf("(")>0) 
            proc = proc.substring(0, proc.indexOf("("));
   
        if (proc.indexOf(".")<0) 
            this.procName = findPgmLibrary(proc) + "." + ProcName;
        else 
            this.procName = ProcName;
        
    }
    
    public String findPgmLibrary(String pgmName) {
         /*
        String rtn = "";
        try {
            CallableStatement cstmt = con.prepareCall("CALL MW4WEB.GETOBJLIB(?,?,?)");
            cstmt.setString (1, pgmName); 
            cstmt.setString (2, "*PGM"); 
            cstmt.registerOutParameter (3, Types.VARCHAR);       
            cstmt.executeUpdate();
            rtn = cstmt.getString(3); 
        } catch (Exception e) {
            e.printStackTrace();
        }  
       return rtn.trim();
       */
       return com.paragon.metalware.Globals.getPgmLib(pgmName);
    }
    
    String buildStoredProcCall() {
          
        String out = "";
        out = "{ call " + procName;  
        if (Parms.size() > 0) {
            out+="(";
            for (int i=0; i<Parms.size();i++){
                if (i>0) out+=",";
                out += "?";
            }
            out+=")";
        }
        out +=  "}";

        try {
            FileWriter geek_file; 
            geek_file = new FileWriter("/home/BEICHHORN/procname.txt", true);
            BufferedWriter geekwrite = new BufferedWriter(geek_file);
            geekwrite.write("OUT= "); 
            geekwrite.write(out);
            geekwrite.close(); 
            } catch (Exception e) {
                e.printStackTrace();
            }

        return out;
    }
    
    public void clearParms() {
        Parms.clear();
    }
    public void setParm(String parmName, String parm) {
        spParm sp;
        try {
            Class c = Class.forName("java.sql.CallableStatement");
            Class argtypes[] = new Class[]{String.class, String.class};
            Method m = c.getMethod("setString", argtypes); 
            FileWriter geek_file; 
                geek_file = new FileWriter("/home/BEICHHORN/parms.txt",true);
                BufferedWriter geekwrite = new BufferedWriter(geek_file);
            if (Parms.containsValue(parmName)){
                sp = (spParm)Parms.get(parmName);
                sp.parm = parm;
                geekwrite.write("PARM1");
                geekwrite.write(parmName + System.lineSeparator());
                geekwrite.write(parm + System.lineSeparator());
                geekwrite.close();    
            }else
                Parms.put(parmName, new spParm(parmName, parm, m));
                geekwrite.write("PARM2");
                geekwrite.write(parmName + System.lineSeparator());
                geekwrite.write(parm + System.lineSeparator());
                geekwrite.close();    
        }catch (Exception e) {
            e.printStackTrace();
            System.exit(2);
        }
    }
    
    public void setParm(String parmName, int parm) {
        spParm sp;
        try {
            Class c = Class.forName("java.sql.CallableStatement");
            Class argtypes[] = new Class[]{String.class, int.class};
            Method m = c.getMethod("setInt", argtypes); 
            if (Parms.containsValue(parmName)){
                sp = (spParm)Parms.get(parmName);
                sp.parm = new Integer(parm);
            }else 
                Parms.put(parmName, new spParm(parmName, new Integer(parm), m));
                FileWriter geek_file; 
                geek_file = new FileWriter("/home/BEICHHORN/parms.txt",true);
                BufferedWriter geekwrite = new BufferedWriter(geek_file); 
                geekwrite.write("PARM3 ");
                geekwrite.write(parmName + System.lineSeparator());
                geekwrite.write(parm + System.lineSeparator());
                geekwrite.close();    

        }catch (Exception e) {
            e.printStackTrace();
            System.exit(2);
        }
    }
    
    public void setParm(String parmName, double parm) {
        spParm sp;
        try {
            Class c = Class.forName("java.sql.CallableStatement");
            Class argtypes[] = new Class[]{String.class, double.class};
            Method m = c.getMethod("setDouble", argtypes); 
            if (Parms.containsValue(parmName)){
                sp = (spParm)Parms.get(parmName);
                sp.parm = new Double(parm);
            }else 
                Parms.put(parmName, new spParm(parmName, new Double(parm), m));
        }catch (Exception e) {
            e.printStackTrace();
            System.exit(2);
        }
    }
    
     public void setParm(String parmName, java.util.Date parm) {
        spParm sp;
        try {
            Class c = Class.forName("java.sql.CallableStatement");
            Class argtypes[] = new Class[]{String.class, java.sql.Date.class};
            Method m = c.getMethod("setDate", argtypes); 
            if (Parms.containsValue(parmName)){
                sp = (spParm)Parms.get(parmName);
                sp.parm = (parm!=null) ? new java.sql.Date(parm.getTime()) : null;
            }else 
                Parms.put(parmName, new spParm(parmName, (parm!=null) ? new java.sql.Date(parm.getTime()) : null, m));
        }catch (Exception e) {
            e.printStackTrace();
            System.exit(2);
        }
    }
    
    public void setOutParm(String parmName) {
        spParm sp;
        try {
            Class c = Class.forName("java.sql.CallableStatement");
            Class argtypes[] = new Class[]{String.class, int.class};
            Method m = c.getMethod("registerOutParameter", argtypes); 
            /*        
            if (Parms.containsValue(parmName)){
                sp = (spParm)Parms.get(parmName);
                sp.parm = parm;
            }else
                Parms.put(parmName, new spParm(parmName, parm, m));
            */
            Parms.put(parmName, new spParm(parmName, new Integer(Types.INTEGER), m));
        }catch (Exception e) {
            e.printStackTrace();
            System.exit(2);
        }
    }
    
    public void setOutParmStr(String parmName) {
        spParm sp;
        try {
            Class c = Class.forName("java.sql.CallableStatement");
            Class argtypes[] = new Class[]{String.class, int.class};
            Method m = c.getMethod("registerOutParameter", argtypes); 
            Parms.put(parmName, new spParm(parmName, new Integer(Types.VARCHAR), m));
        }catch (Exception e) {
            e.printStackTrace();
            System.exit(2);
        }
    }
    
    public String getOutParm(String parmName) {
        String out = "";
        try {
            out = stmt.getString(parmName);
        } catch (Exception e) {}
        return out;
    }
    
    void loadProcParms(CallableStatement stmt) {
        spParm sp;
        try {
            
            FileWriter geek_file; 
            geek_file = new FileWriter("/home/BEICHHORN/lp.txt", true);
            BufferedWriter geekwrite = new BufferedWriter(geek_file);

           // for (int i=0; i<Parms.size(); i++) {
            Iterator P = Parms.values().iterator();

            //System.out.println(P);
            while (P.hasNext()){
                sp = (spParm)P.next();
                geekwrite.write(sp.parmName + System.lineSeparator());
                geekwrite.write(sp.parm + System.lineSeparator());
                sp.setmethod.invoke(stmt, new Object[]{sp.parmName, sp.parm});
            } 
            geekwrite.close();
         } catch (Exception e) {
                e.printStackTrace();
         }  


    }
    
    public ResultSet executeQuery() {

        try {
            stmt = con.prepareCall(buildStoredProcCall());
            loadProcParms(stmt);
            rs = stmt.executeQuery();
            ResultSetMetaData mdata = rs.getMetaData();
        } catch (Exception e) {
            e.printStackTrace();
        }      

        return rs;
    }
    
    public ResultSet getNextResult() {
        try {
            if (stmt.getMoreResults()) {
                rs = stmt.getResultSet();
                mdata = rs.getMetaData();
            } else 
                rs = null;
        }catch (SQLException e) {
             e.printStackTrace();
        }
        return rs;  
    }
    
    public boolean execute() {
        try {
            stmt = con.prepareCall(buildStoredProcCall());
            loadProcParms(stmt);
            return stmt.execute();
        }catch (SQLException e) {
             e.printStackTrace();
             return false;
        }
    }
    
    
}
