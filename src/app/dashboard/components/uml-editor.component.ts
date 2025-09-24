// dashboard/components/uml-editor.component.ts
import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
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
  SnappingService
} from '@syncfusion/ej2-angular-diagrams';
import { ExpandMode } from '@syncfusion/ej2-navigations';

@Component({
  selector: 'app-uml-editor',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [
    DiagramContextMenuService,
    PrintAndExportService,
    BpmnDiagramsService,
    UndoRedoService,
    SnappingService
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      .control-section {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: white;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .sb-mobile-palette {
        width: 320px;
        height: calc(100vh - 120px);
        float: left;
        border: 1px solid rgba(0, 0, 0, 0.12);
        overflow-y: auto;
      }
      
      .sb-mobile-diagram {
        width: calc(100vw - 340px);
        height: calc(100vh - 120px);
        float: left;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-left: none;
      }
      
      .uml-header {
        background: white;
        padding: 15px;
        border-bottom: 1px solid #e0e0e0;
        height: 90px;
        flex-shrink: 0;
        z-index: 1001;
        position: relative;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .editor-content {
        flex: 1;
        overflow: hidden;
        display: flex;
      }
      
      .btn {
        padding: 8px 16px;
        margin-right: 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .btn-primary { background: #2196F3; color: white; }
      .btn-success { background: #4CAF50; color: white; }
      .btn-warning { background: #FF9800; color: white; }
      .btn-info { background: #00BCD4; color: white; }
      .btn-danger { background: #f44336; color: white; }
    </style>
    
    <div class="control-section">
      <!-- Header con botones -->
      <div class="uml-header">
        <h2 style="margin: 0 0 10px 0;">UML Class Diagram Editor</h2>
        <div>
          <button class="btn btn-primary" (click)="addNewClass()">Add Class</button>
          <button class="btn btn-success" (click)="addMethod()">Add Method</button>
          <button class="btn btn-warning" (click)="addAttribute()">Add Attribute</button>
          <button class="btn btn-info" (click)="fitToPage()">Fit to Page</button>
          <button class="btn" style="background: #9C27B0; color: white;" (click)="showAttributeTable()">📋 Attribute Table</button>
          <button class="btn btn-danger" (click)="closeEditor()" style="float: right;">✕ Cerrar Editor</button>
        </div>
      </div>
      
      <!-- Área principal del diagrama -->
      <div class="editor-content">
        <div class="sb-mobile-palette">
          <h4 style="text-align: center; padding: 10px; margin: 0; background: #f5f5f5; border-bottom: 1px solid #e0e0e0;">
            UML Shapes
          </h4>
          <ejs-symbolpalette 
            id="symbolpalette" 
            [expandMode]="expandMode" 
            [palettes]="palettes" 
            [getSymbolInfo]="getSymbolInfo" 
            width="100%" 
            height="calc(100% - 50px)" 
            [symbolHeight]="90"
            [symbolWidth]="90" 
            [symbolMargin]="symbolMargin" 
            [getNodeDefaults]="getSymbolDefaults">
          </ejs-symbolpalette>
        </div>
        
        <div class="sb-mobile-diagram">
          <ejs-diagram 
            #diagram 
            id="diagram" 
            width="100%" 
            height="100%" 
            [getNodeDefaults]="getNodeDefaults"
            [getConnectorDefaults]="getConnectorDefaults" 
            [setNodeTemplate]="setNodeTemplate" 
            [nodes]="nodes" 
            [connectors]="connectors" 
            (created)="created()" 
            (dragEnter)="dragEnter($event)">
          </ejs-diagram>
        </div>
      </div>
    </div>
  `
})
export class UmlEditorComponent implements OnInit {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('symbolpalette') symbolPalette!: SymbolPaletteComponent;

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
        {
          id: 'Interface',
          style: {
            fill: '#26A0DA',
          }, 
          borderColor: 'white',
          shape: {
            type: 'UmlClassifier',
            interfaceShape: {
              name: "Bank Account",
            },
            classifier: 'Interface'
          },
        },
        // Enumeration shape basado en documentación oficial
        {
          id: 'Enumeration',
          style: {
            fill: '#26A0DA',
          }, 
          borderColor: 'white',
          shape: {
            type: 'UmlClassifier',
            enumerationShape: {
              name: 'AccountType',
              members: [
                {
                  name: 'Checking Account', style: {}
                },
              ]
            },
            classifier: 'Enumeration'
          },
        },
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

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('UML Editor initialized with official Syncfusion structure');
  }

  // Set the default values of nodes - from official example
  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.style = { fill: '#26A0DA', strokeColor: 'white' };
    return obj;
  }

  // Set the default values of connectors - from official example
  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    return connector;
  }

  public created(): void {
    this.diagram.fitToPage();
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
    if (this.selectedNodeId && this.diagram) {
      const node = this.diagram.getObject(this.selectedNodeId) as NodeModel;
      if (node && node.shape && (node.shape as any).classifier === 'Class') {
        const method = {
          name: 'newMethod',
          type: 'void'
        };
        
        this.diagram.addChildToUmlNode(node, method, 'Method');
        console.log('Added method to:', this.selectedNodeId);
      }
    } else {
      console.log('Please select a UML Class first');
    }
  }

  addAttribute() {
    if (this.selectedNodeId) {
      const node = this.diagram.getObject(this.selectedNodeId) as NodeModel;
      if (node && node.shape && (node.shape as UmlClassifierShapeModel).type === 'UmlClassifier') {
        // Prompt user for attribute details
        const attributeName = prompt('Enter attribute name:', 'newAttribute') || 'newAttribute';
        const attributeType = prompt('Enter attribute type:', 'String') || 'String';
        const attributeScope = prompt('Enter scope (public/private/protected):', 'public') || 'public';
        
        const attribute = {
          name: attributeName,
          type: attributeType,
          scope: attributeScope,
          style: { color: "black" }
        };
        
        this.diagram.addChildToUmlNode(node, attribute, 'Attribute');
        console.log(`Added attribute "${attributeName}: ${attributeType}" to:`, this.selectedNodeId);
      } else {
        alert('Please select a UML Class or Interface first');
      }
    } else {
      alert('Please select a UML Class or Interface first');
    }
  }

  fitToPage() {
    this.diagram.fitToPage();
  }

  closeEditor() {
    this.router.navigate(['/projects']);
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
}
