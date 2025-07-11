import { mxLog } from "@mxgraph/util/mxLog";
import { mxCodecRegistry } from "@mxgraph/io/mxCodecRegistry";
import { mxCellPath } from "@mxgraph/model/mxCellPath";
import { mxCell } from "@mxgraph/model/mxCell";
import { mxConstants } from "@mxgraph/util/mxConstants";
import { mxUtils } from "@mxgraph/util/mxUtils";
import { mxGeometry } from "@mxgraph/model/mxGeometry"; /*GS*/

export class mxCodec {
  elements = null;
  encodeDefaults = false;

  constructor(document) {
    this.document = document || mxUtils.createXmlDocument();
    this.objects = [];
  }

  putObject(id, obj) {
    this.objects[id] = obj;
    return obj;
  }

  getObject(id) {
    var obj = null;

    if (id != null) {
      obj = this.objects[id];

      if (obj == null) {
        obj = this.lookup(id);

        if (obj == null) {
          var node = this.getElementById(id);

          if (node != null) {
            obj = this.decode(node);
          }
        }
      }
    }

    return obj;
  }

  lookup(id) {
    return null;
  }

  getElementById(id) {
    this.updateElements();
    return this.elements[id];
  }

  updateElements() {
    if (this.elements == null) {
      this.elements = new Object();

      if (this.document.documentElement != null) {
        this.addElement(this.document.documentElement);
      }
    }
  }

  addElement(node) {
    if (node.nodeType == mxConstants.NODETYPE_ELEMENT) {
      var id = node.getAttribute("id");

      if (id != null) {
        if (this.elements[id] == null) {
          this.elements[id] = node;
        } else if (this.elements[id] != node) {
          throw new Error(id + ": Duplicate ID");
        }
      }
    }

    node = node.firstChild;

    while (node != null) {
      this.addElement(node);
      node = node.nextSibling;
    }
  }

  getId(obj) {
    var id = null;

    if (obj != null) {
      id = this.reference(obj);

      if (id == null && obj instanceof mxCell) {
        id = obj.getId();

        if (id == null) {
          id = mxCellPath.create(obj);

          if (id.length == 0) {
            id = "root";
          }
        }
      }
    }

    return id;
  }

  reference(obj) {
    return null;
  }

  encode(obj) {
    var node = null;
    //console.dir(typeof(obj));
    if (obj != null && obj.constructor != null) {
      //var enc = mxCodecRegistry.getCodec(obj.constructor);
      var enc = mxCodecRegistry.getCodec_encode(obj.constructor);

      if (enc != null) {
        node = enc.encode(this, obj);
      } else {
        if (mxUtils.isNode(obj)) {
          node = mxUtils.importNode(this.document, obj, true);
        } else {
          mxLog.warn(
            "mxCodec.encode: No codec for " +
              mxUtils.getFunctionName(obj.constructor),
          );
        }
      }
    }

    return node;
  }

  decode(node, into) {
    this.updateElements();
    var obj = null;

    if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {

      //var ctor = null;
      //try {
      //  ctor = window[node.nodeName];
      //} catch (err) {
      //  /* ignore */
      //}

      //var dec = mxCodecRegistry.getCodec(ctor);
      //var dec = mxCodecRegistry.getCodec(node.nodeName);
	   
      //console.log("decode getCodec:", node.nodeName);
      var dec = mxCodecRegistry.getCodec(node.nodeName);  //GUSA GS

      if (dec != null) {
        obj = dec.decode(this, node, into);
      } else {
        obj = node.cloneNode(true);
        obj.removeAttribute("as");
      }
    }

    return obj;
  }

  decode_tmp(node, into) {
    this.updateElements();
    var obj = null;

    //    if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
    var ctor = null;

    //      try {
    //        ctor = window[node.nodeName];
    //      } catch (err) {
    //        /* ignore */
    //      }
    //
    //     var dec = mxCodecRegistry.getCodec(ctor);  /*  GS  BUG FIX */

    //      var dec = mxCodecRegistry.getCodec(node.nodeName );

    var dec = null;

    var dec = mxCodecRegistry.getCodec(node.nodeName);
    if (dec != null) {
      try {
        /* try GS */
        obj = dec.decode(this, node, into);
      } catch (err) {
        console.log("dec.decode err", err);
      }
    } else {
      //console.log("mxCodec:", node.nodeName, "null",node);
      //console.dir(node.outerHTML.x);
      //obj = node.cloneNode(true);
      //obj.removeAttribute('as');
      if (node.nodeName == "mxGeometry") {
        // <mxGeometry x="350" y="250" width="120" height="60" as="geometry"/>
        const parser = new DOMParser();

        const doc = parser.parseFromString(node.outerHTML, "application/xml");
        //console.dir(doc.documentElement.attributes[0].name);
        //console.dir(doc.documentElement.attributes[0].value);

        let x = 0;
        let y = 0;
        let width = 0;
        let height = 0;

        for (let i = 0; i < doc.documentElement.attributes.length; i++) {
          //console.dir(doc.documentElement.attributes[i].name);
          let name = doc.documentElement.attributes[i].name;

          if (name == "x") {
            x = parseInt(doc.documentElement.attributes[i].value, 10);
          } else if (name == "y") {
            y = parseInt(doc.documentElement.attributes[i].value, 10);
          } else if (name == "width") {
            width = parseInt(doc.documentElement.attributes[i].value, 10);
          } else if (name == "height") {
            height = parseInt(doc.documentElement.attributes[i].value, 10);
          }
        }

        /* GS */
        //obj = new mxGeometry(30, 0, 100, 100);
        obj = new mxGeometry(x, y, width, height);
      } else {
        console.log("mxCodec decode notreg:", node.nodeName);
      }
    }
    //  }
    return obj;
  }

  encodeCell(cell, node, includeChildren) {
    node.appendChild(this.encode(cell));

    if (includeChildren == null || includeChildren) {
      var childCount = cell.getChildCount();

      for (var i = 0; i < childCount; i++) {
        this.encodeCell(cell.getChildAt(i), node);
      }
    }
  }

  isCellCodec(codec) {
    if (codec != null && typeof codec.isCellCodec == "function") {
      return codec.isCellCodec();
    }

    return false;
  }

  decodeCell(node, restoreStructures) {
    restoreStructures = restoreStructures != null ? restoreStructures : true;
    var cell = null;

    if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
      var decoder = mxCodecRegistry.getCodec(node.nodeName);

      if (!this.isCellCodec(decoder)) {
        var child = node.firstChild;

        while (child != null && !this.isCellCodec(decoder)) {
          decoder = mxCodecRegistry.getCodec(child.nodeName);
          child = child.nextSibling;
        }
      }

      if (!this.isCellCodec(decoder)) {
        decoder = mxCodecRegistry.getCodec(mxCell);
      }

      cell = decoder.decode(this, node);

      if (restoreStructures) {
        this.insertIntoGraph(cell);
      }
    }

    return cell;
  }

  insertIntoGraph(cell) {
    var parent = cell.parent;
    var source = cell.getTerminal(true);
    var target = cell.getTerminal(false);
    cell.setTerminal(null, false);
    cell.setTerminal(null, true);
    cell.parent = null;

    if (parent != null) {
      if (parent == cell) {
        throw new Error(parent.id + ": Self Reference");
      } else {
        parent.insert(cell);
      }
    }

    if (source != null) {
      source.insertEdge(cell, true);
    }

    if (target != null) {
      target.insertEdge(cell, false);
    }
  }

  setAttribute(node, attribute, value) {
    if (attribute != null && value != null) {
      node.setAttribute(attribute, value);
    }
  }
}
