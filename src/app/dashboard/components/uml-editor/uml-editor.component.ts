// dashboard/components/uml-editor/uml-editor.component.ts
import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { 
    DiagramComponent, 
    SymbolPaletteComponent,
    NodeModel,
    ConnectorModel,
    PaletteModel,
    SymbolInfo,
    MarginModel,
    UmlClassifierShapeModel,
    IDragEnterEventArgs,
    Connector,
    DiagramContextMenuService,
    PrintAndExportService,
    BpmnDiagramsService,
    UndoRedoService,
    SnappingService,
    ISelectionChangeEventArgs,
    LayoutModel,
    HierarchicalTreeService 
} from '@syncfusion/ej2-angular-diagrams';
import { ExpandMode } from '@syncfusion/ej2-navigations';
import type { Selector } from '@syncfusion/ej2-diagrams'; 

@Component({
  selector: 'app-uml-editor',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [
    DiagramContextMenuService,
    PrintAndExportService,
    BpmnDiagramsService,
    UndoRedoService,
    SnappingService,
    HierarchicalTreeService
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './uml-editor.component.html',
  styleUrl: './uml-editor.component.scss'
})
export class UmlEditorComponent implements OnInit {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('symbolpalette') symbolPalette!: SymbolPaletteComponent;

  public layout: LayoutModel = { type: 'HierarchicalTree', orientation: 'TopToBottom' };

  public created(): void {
    this.diagram.layout = this.layout;
    this.diagram.doLayout();
    this.diagram.fitToPage();
  }
  
  autolayout(){
    this.diagram.doLayout();
  }

  public expandMode: ExpandMode = 'Multiple';
  
  // Palette configuration basado en el ejemplo oficial
  public palettes: PaletteModel[] = [
    {
      id: 'UmlShapes', 
      expanded: true, 
      title: 'UML Classifier Shapes', 
      symbols: [
        // Class shape basado en documentación oficial
        {
          id: 'class',
          style: {
            fill: '#26A0DA',
          },
          borderColor: 'white',
          shape: {
            type: 'UmlClassifier',
            classShape: {
              attributes: [
                { name: 'accepted', type: 'Date', style: { color: "red", fontFamily: "Arial", textDecoration: 'Underline', italic: true }, isSeparator: true },
              ],
              methods: [{ name: 'getHistory', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }],
              name: 'Patient'
            },
            classifier: 'Class'
          },
        },
        // Interface shape basado en documentación oficial
        // {
        //   id: 'Interface',
        //   style: {
        //     fill: '#26A0DA',
        //   }, 
        //   borderColor: 'white',
        //   shape: {
        //     type: 'UmlClassifier',
        //     interfaceShape: {
        //       name: "Bank Account",
        //     },
        //     classifier: 'Interface'
        //   },
        // },
        // Enumeration shape basado en documentación oficial
        // {
        //   id: 'Enumeration',
        //   style: {
        //     fill: '#26A0DA',
        //   }, 
        //   borderColor: 'white',
        //   shape: {
        //     type: 'UmlClassifier',
        //     enumerationShape: {
        //       name: 'AccountType',
        //       members: [
        //         {
        //           name: 'Checking Account', style: {}
        //         },
        //       ]
        //     },
        //     classifier: 'Enumeration'
        //   },
        // },
      ]
    },
    {
      id: 'umlConnectors', 
      expanded: true, 
      title: 'UML Relationships', 
      symbols: [
        // Association (Default)
        {
          id: 'Association-Default',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: {
            type: 'UmlClassifier',
            relationship: 'Association',
            associationType: 'Default'
          }
        },
        // Association (BiDirectional)
        {
          id: 'Association-BiDirectional',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: {
            type: 'UmlClassifier',
            relationship: 'Association',
            associationType: 'BiDirectional'
          }
        },
        // Aggregation
        {
          id: 'Aggregation',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: { 
            type: 'UmlClassifier', 
            relationship: 'Aggregation' 
          }
        },
        // Composition
        {
          id: 'Composition',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: { 
            type: 'UmlClassifier', 
            relationship: 'Composition' 
          }
        },
        // Inheritance
        {
          id: 'Inheritance',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: { 
            type: 'UmlClassifier', 
            relationship: 'Inheritance' 
          }
        },
        // Dependency
        {
          id: 'Dependency',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: { 
            type: 'UmlClassifier', 
            relationship: 'Dependency' 
          }
        }
      ]
    },
    {
      id: 'umlMultiplicity', 
      expanded: false, 
      title: 'UML Multiplicity', 
      symbols: [
        // OneToOne
        {
          id: 'OneToOne',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: {
            type: 'UmlClassifier',
            relationship: 'Dependency',
            multiplicity: {
              type: 'OneToOne',
            },
          },
        },
        // ManyToOne
        {
          id: 'ManyToOne',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: {
            type: 'UmlClassifier',
            relationship: 'Dependency',
            multiplicity: {
              type: 'ManyToOne',
              source: {
                optional: true,
                lowerBounds: '0',
                upperBounds: '*',
              },
              target: {
                optional: true,
                lowerBounds: '1',
                upperBounds: '1',
              },
            },
          },
        },
        // OneToMany
        {
          id: 'OneToMany',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: {
            type: 'UmlClassifier',
            relationship: 'Dependency',
            multiplicity: {
              type: 'OneToMany',
              source: {
                optional: true,
                lowerBounds: '1',
                upperBounds: '1',
              },
              target: {
                optional: true,
                lowerBounds: '0',
                upperBounds: '*',
              },
            },
          },
        },
        // ManyToMany
        {
          id: 'ManyToMany',
          sourcePoint: { x: 0, y: 0 },
          targetPoint: { x: 60, y: 0 },
          type: 'Straight',
          shape: {
            type: 'UmlClassifier',
            relationship: 'Dependency',
            multiplicity: {
              type: 'ManyToMany',
              source: {
                optional: true,
                lowerBounds: '0',
                upperBounds: '*',
              },
              target: {
                optional: true,
                lowerBounds: '0',
                upperBounds: '*',
              },
            },
          },
        }
      ]
    }
  ];

  // Nodos basados en el ejemplo oficial
  public nodes: NodeModel[] = [
    {
      id: 'Patient',
      shape: {
        type: 'UmlClassifier',
        classShape: {
          name: 'Patient',
          attributes: [
            this.createProperty('id', 'Number'),
            this.createProperty('name', 'String'),
            this.createProperty('age', 'Number')
          ],
          methods: [
            this.createMethods('getName', 'String'),
            this.createMethods('getAge', 'Number')
          ]
        },
        classifier: 'Class'
      } as UmlClassifierShapeModel,
      offsetX: 200,
      offsetY: 250
    },
    {
      id: 'Doctor',
      shape: {
        type: 'UmlClassifier',
        classShape: {
          name: 'Doctor',
          attributes: [
            this.createProperty('specialist', 'String'),
            this.createProperty('experience', 'Number')
          ]
        },
        classifier: 'Class'
      } as UmlClassifierShapeModel,
      offsetX: 500,
      offsetY: 250
    }
  ];

  public connectors: ConnectorModel[] = [
    this.createConnector('connect1', 'Patient', 'Doctor')
  ];

  public symbolMargin: MarginModel = {
    left: 12, right: 12, top: 12, bottom: 12 
  };

  selectedNodeId: string | null = null;

  showExportMenu = false;

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('UML Editor initialized with official Syncfusion structure');
  }

  // Set the default values of nodes - from official example
  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.style = { fill: '#26A0DA', strokeColor: 'white' };
    return obj;
  }

  public getConnectorDefaults(c: ConnectorModel): ConnectorModel {
    // Estilo base
    c.type = 'Orthogonal';
    c.style = { strokeWidth:1.5, strokeColor:'#64748b' }; // slate-500
    c.targetDecorator = { width:10, height:10, style:{ fill:'#fff', strokeColor:'#64748b' } };
    (c as any).shape = (c as any).shape || { type:'UmlClassifier', relationship:'Association' };
    return c;
  }

  public dragEnter(arg: IDragEnterEventArgs): void {
    if(arg.element instanceof Connector && arg.element.targetPoint){
      if (arg.element.targetPoint.x !== undefined) {
        arg.element.targetPoint.x += 100;
      }
      if (arg.element.targetPoint.y !== undefined) {
        arg.element.targetPoint.y += 20;
      }
    }
  }

  // Set an annotation style at runtime - from official example
  public setNodeTemplate(node: NodeModel): void {
    if (node.annotations && node.annotations.length > 0) {
      for (let i: number = 0; i < node.annotations.length; i++) {
        node.annotations[i].style = { color: 'white' };
      }
    }
  }

  public getSymbolDefaults(symbol: NodeModel): void {
    symbol.width = 100;
    symbol.height = 100;
  }

  public getSymbolInfo(symbol: NodeModel): SymbolInfo {
    return { 
      fit: true,
      description: { 
        text: symbol.id || 'Symbol'
      },
      tooltip: symbol.addInfo ? (symbol.addInfo as any)['tooltip'] : symbol.id 
    };
  }

  // Helper functions from official example
  public createConnector(id: string, sourceID: string, targetID: string): ConnectorModel {
    let connector: ConnectorModel = {};
    connector.id = id;
    connector.sourceID = sourceID;
    connector.targetID = targetID;
    return connector;
  }

  public createNode(id: string, offsetX: number, offsetY: number, className: string): NodeModel {
    let node: NodeModel = {};
    node.id = id;
    node.offsetX = offsetX;
    node.offsetY = offsetY;
    node.shape = {
      type: 'UmlClassifier',
      classShape: {
        name: className
      },
      classifier: 'Class'
    } as UmlClassifierShapeModel;
    return node;
  }

  public createProperty(name: string, type: string): object {
    return { name: name, type: type };
  }

  public createMethods(name: string, type: string): object {
    return { name: name, type: type };
  }

  // Button actions
  addNewClass() {
    const newClass = this.createNode('Class_' + Date.now(), 400, 400, 'NewClass');
    this.diagram.add(newClass);
    console.log('Added new class');
  }

  addMethod() {
    const id = this.selectedNodeId;
    if(!id){ alert('Selecciona una clase primero'); return; }
    const node = this.diagram.getObject(id) as NodeModel;
    const method = { name:'newMethod', type:'void', parameters:[{name:'p', type:'String'}] };
    this.diagram.addChildToUmlNode(node, method, 'Method');
  }

  addAttribute() {
    const id = this.selectedNodeId;
    if(!id){ alert('Selecciona una clase o interfaz'); return; }
    const node = this.diagram.getObject(id) as NodeModel;
    const attribute = { name:'newAttribute', type:'String', scope:'public' };
    this.diagram.addChildToUmlNode(node, attribute, 'Attribute');
  }

  // Helpers para cambiar tipo de conectores:
  setInheritance(conn: ConnectorModel){
    (conn as any).shape.relationship = 'Inheritance';
    conn.targetDecorator = { 
        shape:'Arrow', 
        width:12, 
        height:12, 
        style:{ fill:'#fff', strokeColor:'#64748b' } 
    };
  }
  
  setComposition(conn: ConnectorModel){
    (conn as any).shape.relationship = 'Composition';
    conn.targetDecorator = { 
        shape:'Diamond', 
        width:12, 
        height:12, 
        style:{ fill:'#64748b', strokeColor:'#64748b' } 
    };
  }
  
  setAggregation(conn: ConnectorModel){
    (conn as any).shape.relationship = 'Aggregation';
    conn.targetDecorator = { 
        shape:'Diamond', 
        width:12, 
        height:12, 
        style:{ fill:'#fff', strokeColor:'#64748b' } 
    };
  }

  setOneToMany(){
    const sel = this.diagram.selectedItems?.connectors?.[0] as ConnectorModel;
    if(!sel) return;
    (sel as any).shape.multiplicity = {
      type:'OneToMany',
      source:{ optional:false, lowerBounds:'1', upperBounds:'1' },
      target:{ optional:true,  lowerBounds:'0', upperBounds:'*' }
    };
    this.diagram.dataBind(); // aplica cambios
  }

  showAttributeTable() {
    if (this.selectedNodeId) {
      const node = this.diagram.getObject(this.selectedNodeId) as NodeModel;
      if (node && node.shape && (node.shape as UmlClassifierShapeModel).type === 'UmlClassifier') {
        const shape = node.shape as UmlClassifierShapeModel;
        let attributes: any[] = [];
        let methods: any[] = [];
        
        if (shape.classShape) {
          attributes = shape.classShape.attributes || [];
          methods = shape.classShape.methods || [];
        } else if (shape.interfaceShape) {
          attributes = shape.interfaceShape.attributes || [];
          methods = shape.interfaceShape.methods || [];
        }
        
        // Crear una representación simple en consola (posteriormente se puede hacer un modal)
        console.log('=== ATTRIBUTE TABLE ===');
        console.log('Class/Interface:', shape.classShape?.name || shape.interfaceShape?.name || 'Unknown');
        console.log('\nAttributes:');
        console.table(attributes.map((attr: any) => ({
          Name: attr.name,
          Type: attr.type,
          Scope: attr.scope || 'public'
        })));
        
        console.log('\nMethods:');
        console.table(methods.map((method: any) => ({
          Name: method.name,
          Parameters: method.parameters?.map((p: any) => `${p.name}: ${p.type}`).join(', ') || '',
          ReturnType: method.type,
          Scope: method.scope || 'public'
        })));
        
        alert(`Attribute table for "${shape.classShape?.name || shape.interfaceShape?.name}" shown in console (F12 > Console tab)`);
      }
    } else {
      alert('Please select a UML Class or Interface first');
    }
  }

  logJson(){
    const json = this.diagram.saveDiagram();
    console.info('SYNCFUSION_JSON', JSON.parse(json));
  }

  fitToPage() {
    this.diagram.fitToPage();
  }

  closeEditor() {
    this.router.navigate(['/projects']);
  }

  onSelectionChange(e: ISelectionChangeEventArgs){
    const v = e.newValue as Selector | (NodeModel | ConnectorModel)[];

    // Caso 1: Selector (tiene .nodes)
    if (v && (v as any).nodes !== undefined) {
      const nodes = (v as Selector).nodes as NodeModel[];
      this.selectedNodeId = nodes?.length ? (nodes[0].id as string) : null;
      return;
    }

    // Caso 2: Array de seleccionados
    if (Array.isArray(v)) {
      const firstNode = v.find(el => (el as NodeModel).id && (el as any).offsetX !== undefined) as NodeModel | undefined;
      this.selectedNodeId = firstNode ? (firstNode.id as string) : null;
      return;
    }

    this.selectedNodeId = null;
  }

    // Exportar imagen del diagrama
    async exportImage(format: 'PNG' | 'SVG') {
        // Opcional: nombre basado en proyecto/fecha
        const fileName = `uml-diagram-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}`;

        // Ajusta región y fondo según lo que quieras capturar:
        await this.diagram.exportDiagram({
            format,                      // 'PNG' | 'SVG' | 'JPG'
            fileName,
            multiplePage: false,         // una sola imagen
            region: 'Content',           // 'PageSettings' para incluir márgenes/página
            mode: 'Download',            // descarga directa
            //margin: { left: 20, right: 20, top: 20, bottom: 20 },
            //backgroundColor: this.isDark() ? '#0f172a' : '#ffffff' // opcional: contraste imagen
        });
    }

    // private isDark(): boolean {
    //     return document.documentElement.classList.contains('app-dark');
    // }

}