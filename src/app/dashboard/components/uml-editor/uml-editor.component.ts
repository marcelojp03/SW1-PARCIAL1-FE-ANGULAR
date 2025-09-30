// dashboard/components/uml-editor/uml-editor.component.ts
import { Component, ViewChild, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { SyncfusionService } from '../../../shared/services/syncfusion.service';
import { ProjectService } from '../../../shared/services/project.service';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { UnsavedChangesDialog, UnsavedChangesResult } from '../unsaved-changes-dialog/unsaved-changes-dialog.component';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-uml-editor',
  standalone: true,
  imports: [CommonModule, SharedModule, UnsavedChangesDialog, AiChatComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DiagramContextMenuService,
    PrintAndExportService,
    BpmnDiagramsService,
    UndoRedoService,
    SnappingService,
    HierarchicalTreeService,
    MessageService,
    ConfirmationService
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './uml-editor.component.html',
  styleUrl: './uml-editor.component.scss'
})
export class UmlEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('symbolpalette') symbolPalette!: SymbolPaletteComponent;

  public layout: LayoutModel = { type: 'HierarchicalTree', orientation: 'TopToBottom' };
  
  // ID del proyecto actual
  public projectId: string = '';

  // Información del proyecto
  public project: any;
  
  // Estado de guardado
  public hasUnsavedChanges: boolean = false;
  public showUnsavedDialog: boolean = false;
  
  // Menú de exportación
  public exportMenuItems: MenuItem[] = [];

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
              // COMENTADO: Auto-completado de clase con datos predefinidos
              // attributes: [
              //   { name: 'accepted', type: 'Date', style: { color: "red", fontFamily: "Arial", textDecoration: 'Underline', italic: true }, isSeparator: true },
              // ],
              // methods: [{ name: 'getHistory', style: {}, parameters: [{ name: 'Date', style: {} }], type: 'History' }],
              // name: 'Patient'
              
              // Clase vacía para que el usuario la personalice
              attributes: [],
              methods: [],
              name: 'Class'
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
    // {
    //   id: 'umlMultiplicity', 
    //   expanded: false, 
    //   title: 'UML Multiplicity', 
    //   symbols: [
    //     // OneToOne
    //     {
    //       id: 'OneToOne',
    //       sourcePoint: { x: 0, y: 0 },
    //       targetPoint: { x: 60, y: 0 },
    //       type: 'Straight',
    //       shape: {
    //         type: 'UmlClassifier',
    //         relationship: 'Dependency',
    //         multiplicity: {
    //           type: 'OneToOne',
    //         },
    //       },
    //     },
    //     // ManyToOne
    //     {
    //       id: 'ManyToOne',
    //       sourcePoint: { x: 0, y: 0 },
    //       targetPoint: { x: 60, y: 0 },
    //       type: 'Straight',
    //       shape: {
    //         type: 'UmlClassifier',
    //         relationship: 'Dependency',
    //         multiplicity: {
    //           type: 'ManyToOne',
    //           source: {
    //             optional: true,
    //             lowerBounds: '0',
    //             upperBounds: '*',
    //           },
    //           target: {
    //             optional: true,
    //             lowerBounds: '1',
    //             upperBounds: '1',
    //           },
    //         },
    //       },
    //     },
    //     // OneToMany
    //     {
    //       id: 'OneToMany',
    //       sourcePoint: { x: 0, y: 0 },
    //       targetPoint: { x: 60, y: 0 },
    //       type: 'Straight',
    //       shape: {
    //         type: 'UmlClassifier',
    //         relationship: 'Dependency',
    //         multiplicity: {
    //           type: 'OneToMany',
    //           source: {
    //             optional: true,
    //             lowerBounds: '1',
    //             upperBounds: '1',
    //           },
    //           target: {
    //             optional: true,
    //             lowerBounds: '0',
    //             upperBounds: '*',
    //           },
    //         },
    //       },
    //     },
    //     // ManyToMany
    //     {
    //       id: 'ManyToMany',
    //       sourcePoint: { x: 0, y: 0 },
    //       targetPoint: { x: 60, y: 0 },
    //       type: 'Straight',
    //       shape: {
    //         type: 'UmlClassifier',
    //         relationship: 'Dependency',
    //         multiplicity: {
    //           type: 'ManyToMany',
    //           source: {
    //             optional: true,
    //             lowerBounds: '0',
    //             upperBounds: '*',
    //           },
    //           target: {
    //             optional: true,
    //             lowerBounds: '0',
    //             upperBounds: '*',
    //           },
    //         },
    //       },
    //     }
    //   ]
    // }
  ];

  // Template por defecto de Syncfusion - COMENTADO para empezar con diagrama vacío
  // Nodos basados en el ejemplo oficial
  public nodes: NodeModel[] = [
    // {
    //   id: 'Patient',
    //   shape: {
    //     type: 'UmlClassifier',
    //     classShape: {
    //       name: 'Patient',
    //       attributes: [
    //         this.createProperty('id', 'Number'),
    //         this.createProperty('name', 'String'),
    //         this.createProperty('age', 'Number')
    //       ],
    //       methods: [
    //         this.createMethods('getName', 'String'),
    //         this.createMethods('getAge', 'Number')
    //       ]
    //     },
    //     classifier: 'Class'
    //   } as UmlClassifierShapeModel,
    //   offsetX: 200,
    //   offsetY: 250
    // },
    // {
    //   id: 'Doctor',
    //   shape: {
    //     type: 'UmlClassifier',
    //     classShape: {
    //       name: 'Doctor',
    //       attributes: [
    //         this.createProperty('specialist', 'String'),
    //         this.createProperty('experience', 'Number')
    //       ]
    //     },
    //     classifier: 'Class'
    //   } as UmlClassifierShapeModel,
    //   offsetX: 500,
    //   offsetY: 250
    // }
  ];

  public connectors: ConnectorModel[] = [
    // this.createConnector('connect1', 'Patient', 'Doctor')
  ];

  public symbolMargin: MarginModel = {
    left: 12, right: 12, top: 12, bottom: 12 
  };

  selectedNodeId: string | null = null;

  showExportMenu = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private syncfusionService: SyncfusionService,
    private projectService: ProjectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    console.log('UML Editor initialized with official Syncfusion structure');
    
    // Inicializar menú de exportación
    this.initializeExportMenu();
    
    // Obtener ID del proyecto desde la ruta
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        this.loadProjectInfo();
        this.loadProject();
      }
    });

    // Detectar cambios en el navegador (cerrar pestaña/ventana)
    window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit - Diagram component ready');
    // Asegurar que el diagrama esté completamente inicializado
    setTimeout(() => {
      if (this.diagram) {
        console.log('Diagram component is available after view init');
        this.diagram.fitToPage();
      }
    }, 500);
  }

  initializeExportMenu() {
    this.exportMenuItems = [
      {
        label: 'Imagen PNG',
        icon: 'pi pi-image',
        command: () => this.exportImage('PNG')
      },
      {
        label: 'Imagen SVG',
        icon: 'pi pi-file',
        command: () => this.exportImage('SVG')
      },
      {
        separator: true
      },
      {
        label: 'Spring Boot (.zip)',
        icon: 'pi pi-download',
        command: () => this.exportToSpringBoot()
      }
    ];
  }

  ngOnDestroy() {
    // Limpiar event listener
    window.removeEventListener('beforeunload', this.onBeforeUnload.bind(this));
  }

  // Detecta cuando el usuario intenta cerrar la pestaña/ventana
  onBeforeUnload(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = ''; // Algunos navegadores requieren esto
      return '¿Estás seguro de que quieres salir? Tienes cambios sin guardar.';
    }
    return null;
  }

  /**
   * Carga el proyecto y restaura el diagrama si existe
   */

  private loadProjectInfo(): void {
    this.projectService.getById(this.projectId).subscribe({
      next: (diagramData) => {
        if (diagramData && Object.keys(diagramData).length > 0) {
          this.project = diagramData; // Guardar info del proyecto
          // Cargar el diagrama guardado
          setTimeout(() => {
            this.diagram.loadDiagram(JSON.stringify(diagramData));
            console.log('Diagram restored from server');
          }, 100);
        } else {
          console.log('No saved diagram found, starting fresh');
        }
      },
      error: (error) => {
        console.warn('Could not restore project, starting fresh:', error);
        // No mostrar error al usuario, simplemente empezar con diagrama vacío
      }
    });
  }
  private loadProject(): void {
    console.log('Starting loadProject for ID:', this.projectId);
    this.projectService.restoreProject(this.projectId).subscribe({
      next: (diagramData) => {
        console.log('Received diagram data:', diagramData);
        if (diagramData && Object.keys(diagramData).length > 0) {
          // Cargar el diagrama guardado con más tiempo para asegurar que el DOM esté listo
          setTimeout(() => {
            if (this.diagram) {
              console.log('Loading diagram with data:', JSON.stringify(diagramData));
              this.diagram.loadDiagram(JSON.stringify(diagramData));
              // Asegurar que el diagrama se muestre correctamente
              setTimeout(() => {
                this.diagram.fitToPage();
                console.log('Diagram loaded and fitted to page');
              }, 200);
            } else {
              console.error('Diagram component not available');
            }
          }, 300); // Aumentar el timeout
        } else {
          console.log('No saved diagram found, starting fresh');
        }
      },
      error: (error) => {
        console.warn('Could not restore project, starting fresh:', error);
        // No mostrar error al usuario, simplemente empezar con diagrama vacío
      }
    });
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
    this.markAsChanged();
    console.log('Added new class');
  }

  addMethod() {
    const id = this.selectedNodeId;
    if(!id){ alert('Selecciona una clase primero'); return; }
    const node = this.diagram.getObject(id) as NodeModel;
    const method = { name:'newMethod', type:'void', parameters:[{name:'p', type:'String'}] };
    this.diagram.addChildToUmlNode(node, method, 'Method');
    this.markAsChanged();
  }

  /**
   * Maneja las acciones solicitadas por el AI Chat
   */
  handleAIAction(action: any): void {
    console.log('AI Action received:', action);
    
    switch (action.type) {
      case 'ai_update_diagram':
        this.updateDiagramFromAI(action.data);
        break;
      default:
        console.warn('Unknown AI action type:', action.type);
    }
  }

  /**
   * Actualiza el diagrama con los datos recibidos de la API de IA
   */
  private updateDiagramFromAI(data: any): void {
    try {
      if (data.syncfusion) {
        console.log('Updating diagram with AI data:', data.syncfusion);
        
        // Cargar el diagrama actualizado
        this.diagram.loadDiagram(JSON.stringify(data.syncfusion));
        this.diagram.dataBind();
        
        // Marcar como modificado
        this.markAsChanged();
        
        // Auto-layout opcional
        setTimeout(() => {
          this.autolayout();
        }, 500);
        
        console.log('Diagram updated successfully from AI');
      }
    } catch (error) {
      console.error('Error updating diagram from AI:', error);
      this.messageService.add({
        key: 'br',
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el diagrama',
        life: 3000
      });
    }
  }

  /**
   * Genera una clase basada en los datos del AI
   */
  private generateClassFromAI(classData: any): void {
    const x = Math.random() * 400 + 100;
    const y = Math.random() * 300 + 100;
    
    const newClass = this.createNode(
      'AIClass_' + Date.now(), 
      x, 
      y, 
      classData.name || 'AIGeneratedClass'
    );

    // Agregar la clase al diagrama
    this.diagram.add(newClass);
    
    // Agregar atributos si existen
    if (classData.attributes && classData.attributes.length > 0 && newClass.id) {
      const node = this.diagram.getObject(newClass.id) as NodeModel;
      classData.attributes.forEach((attr: string) => {
        const [name, type] = attr.split(':').map(s => s.trim());
        const attribute = { 
          name: name || 'attribute', 
          type: type || 'String',
          scope: 'public'
        };
        this.diagram.addChildToUmlNode(node, attribute, 'Attribute');
      });
    }

    // Agregar métodos si existen
    if (classData.methods && classData.methods.length > 0 && newClass.id) {
      const node = this.diagram.getObject(newClass.id) as NodeModel;
      classData.methods.forEach((methodName: string) => {
        const method = { 
          name: methodName.replace('()', ''), 
          type: 'void', 
          parameters: []
        };
        this.diagram.addChildToUmlNode(node, method, 'Method');
      });
    }

    this.markAsChanged();
    
    // Mostrar mensaje de éxito
    this.messageService.add({
      key: 'br',
      severity: 'success',
      summary: 'AI Assistant',
      detail: `Clase "${classData.name}" creada exitosamente`,
      life: 3000
    });
  }

  /**
   * Crea un diagrama completo basado en los datos del AI
   */
  private createDiagramFromAI(diagramData: any): void {
    // Limpiar diagrama existente si es necesario
    if (diagramData.clearExisting) {
      this.diagram.clear();
    }

    const classes: NodeModel[] = [];
    const spacing = 200;
    let x = 100;
    let y = 100;

    // Crear clases
    if (diagramData.classes) {
      diagramData.classes.forEach((className: string, index: number) => {
        const classNode = this.createNode(
          'AIClass_' + className + '_' + Date.now(),
          x + (index % 3) * spacing,
          y + Math.floor(index / 3) * spacing,
          className
        );

        // Agregar atributos predeterminados basados en el tipo
        const defaultAttributes = this.getDefaultAttributesForClass(className);
        classes.push(classNode);
        this.diagram.add(classNode);

        // Agregar atributos por defecto
        if (classNode.id) {
          const node = this.diagram.getObject(classNode.id) as NodeModel;
          defaultAttributes.forEach(attr => {
            this.diagram.addChildToUmlNode(node, attr, 'Attribute');
          });
        }
      });
    }

    // Crear relaciones si se especifican
    if (diagramData.relationships) {
      setTimeout(() => {
        diagramData.relationships.forEach((rel: string) => {
          const [source, target] = rel.split('->').map(s => s.trim());
          const sourceNode = classes.find(c => (c.shape as any)?.classShape?.name === source);
          const targetNode = classes.find(c => (c.shape as any)?.classShape?.name === target);
          
          if (sourceNode && targetNode) {
            const connector = this.createConnector(
              'AIRel_' + Date.now(),
              sourceNode.id!,
              targetNode.id!
            );
            this.diagram.add(connector);
          }
        });
      }, 100);
    }

    this.markAsChanged();
    
    // Aplicar auto layout después de crear todo
    setTimeout(() => {
      this.autolayout();
    }, 200);

    this.messageService.add({
      key: 'br',
      severity: 'success',
      summary: 'AI Assistant',
      detail: `Diagrama ${diagramData.type || 'completo'} generado exitosamente`,
      life: 3000
    });
  }

  /**
   * Agrega una relación basada en los datos del AI
   */
  private addRelationshipFromAI(relationshipData: any): void {
    // Esta función necesitaría más lógica para identificar las clases existentes
    console.log('Adding relationship:', relationshipData);
    
    this.messageService.add({
      key: 'br',
      severity: 'info',
      summary: 'AI Assistant',
      detail: 'Función de relaciones en desarrollo',
      life: 3000
    });
  }

  /**
   * Modifica un atributo basado en los datos del AI
   */
  private modifyAttributeFromAI(attributeData: any): void {
    console.log('Modifying attribute:', attributeData);
    
    this.messageService.add({
      key: 'br',
      severity: 'info',
      summary: 'AI Assistant',
      detail: 'Función de modificación en desarrollo',
      life: 3000
    });
  }

  /**
   * Obtiene atributos predeterminados para una clase basada en su nombre
   */
  private getDefaultAttributesForClass(className: string): any[] {
    const lowerName = className.toLowerCase();
    
    if (lowerName.includes('user') || lowerName.includes('usuario')) {
      return [
        { name: 'id', type: 'String', scope: 'Private' },
        { name: 'name', type: 'String', scope: 'Private' },
        { name: 'email', type: 'String', scope: 'Private' },
        { name: 'createdAt', type: 'Date', scope: 'Private' }
      ];
    } else if (lowerName.includes('product') || lowerName.includes('producto')) {
      return [
        { name: 'id', type: 'String', scope: 'Private' },
        { name: 'name', type: 'String', scope: 'Private' },
        { name: 'price', type: 'Double', scope: 'Private' },
        { name: 'description', type: 'String', scope: 'Private' }
      ];
    } else if (lowerName.includes('order') || lowerName.includes('pedido')) {
      return [
        { name: 'id', type: 'String', scope: 'Private' },
        { name: 'orderDate', type: 'Date', scope: 'Private' },
        { name: 'total', type: 'Double', scope: 'Private' },
        { name: 'status', type: 'String', scope: 'Private' }
      ];
    } else if (lowerName.includes('post') || lowerName.includes('blog')) {
      return [
        { name: 'id', type: 'String', scope: 'Private' },
        { name: 'title', type: 'String', scope: 'Private' },
        { name: 'content', type: 'String', scope: 'Private' },
        { name: 'publishedAt', type: 'Date', scope: 'Private' }
      ];
    } else {
      return [
        { name: 'id', type: 'String', scope: 'Private' },
        { name: 'name', type: 'String', scope: 'Private' },
        { name: 'createdAt', type: 'Date', scope: 'Private' }
      ];
    }
  }

  /**
   * Marca el proyecto como modificado
   */
  private markAsChanged(): void {
    this.hasUnsavedChanges = true;
  }

  addAttribute() {
    const id = this.selectedNodeId;
    if(!id){ alert('Selecciona una clase o interfaz'); return; }
    const node = this.diagram.getObject(id) as NodeModel;
    const attribute = { name:'newAttribute', type:'String', scope:'public' };
    this.diagram.addChildToUmlNode(node, attribute, 'Attribute');
    this.markAsChanged();
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
    const diagramData = JSON.parse(json);
    
    console.info('SYNCFUSION_JSON', diagramData);

    // Enviar al endpoint de echo para pruebas
    this.syncfusionService.echo(diagramData).subscribe({
      next: (response) => {
        console.info('Echo response:', response);
        this.messageService.add({
          key: 'br',
          severity: 'success',
          summary: 'JSON enviado correctamente',
          detail: 'Datos enviados al endpoint de pruebas',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error sending JSON:', error);
        this.messageService.add({
          key: 'br',
          severity: 'error',
          summary: 'Error al enviar JSON',
          detail: 'No se pudo conectar con el servidor',
          life: 3000
        });
      }
    });
  }

  /**
   * Guarda el proyecto completo (Thumbnail + JSON crudo + conversión a canónico)
   */
  saveProject(): void {
    if (!this.projectId) {
      this.messageService.add({
        key: 'br',
        severity: 'error',
        summary: 'Error',
        detail: 'No hay proyecto seleccionado',
        life: 3000
      });
      return;
    }

    console.log('[UMLEditor] Starting complete project save');
    const json = this.diagram.saveDiagram();
    const diagramData = JSON.parse(json);
    console.log('[UMLEditor] Diagram data extracted:', diagramData);

    // Generar thumbnail
    let thumbnailDataUri: string | undefined;
    try {
      thumbnailDataUri = this.diagram.exportDiagram({
        mode: 'Data',
        format: 'PNG',
        region: 'Content'
      }) as string;
      console.log('[UMLEditor] Thumbnail generated, length:', thumbnailDataUri.length);
    } catch (error) {
      console.warn('[UMLEditor] Could not generate thumbnail:', error);
      thumbnailDataUri = undefined;
    }

    // Guardado completo unificado
    this.projectService.saveCompleteProject(this.projectId, diagramData, thumbnailDataUri).subscribe({
      next: (result) => {
        console.log('[UMLEditor] Complete save successful:', result);
        this.hasUnsavedChanges = false; // Limpiar flag de cambios no guardados
        
        let detail = 'Diagrama y modelo canónico actualizados';
        if (result.thumbnail) {
          detail += ' (con thumbnail)';
        }
        
        this.messageService.add({
          key: 'br',
          severity: 'success',
          summary: 'Proyecto guardado completamente',
          detail: detail,
          life: 3000
        });
      },
      error: (error) => {
        console.error('[UMLEditor] Error in complete save:', error);
        this.messageService.add({
          key: 'br',
          severity: 'error',
          summary: 'Error al guardar',
          detail: 'No se pudo guardar el proyecto completamente',
          life: 3000
        });
      }
    });
  }

  fitToPage() {
    this.diagram.fitToPage();
  }

  closeEditor() {
    if (this.hasUnsavedChanges) {
      this.showUnsavedDialog = true;
    } else {
      // No hay cambios, cerrar directamente
      this.router.navigate(['/projects']);
    }
  }

  onUnsavedChangesResult(result: UnsavedChangesResult) {
    switch (result.action) {
      case 'save':
        // Mostrar mensaje de guardado
        this.messageService.add({
          severity: 'info',
          summary: 'Guardando...',
          detail: 'Guardando el proyecto antes de salir'
        });
        // Guardar y luego cerrar
        this.saveProject();
        // El navigate se hará después de que se complete el guardado
        setTimeout(() => {
          this.hasUnsavedChanges = false;
          this.router.navigate(['/projects']);
        }, 2000); // Dar tiempo para que se complete el guardado
        break;
      
      case 'discard':
        // Cerrar sin guardar
        this.hasUnsavedChanges = false;
        this.router.navigate(['/projects']);
        break;
      
      case 'cancel':
        // No hacer nada, el diálogo ya se cerró
        break;
    }
  }

  // Método saveAsThumbnail removido - ahora está integrado en saveProject()

  /**
   * Exporta el proyecto a Spring Boot
   */
  exportToSpringBoot(): void {
    if (!this.projectId) return;

    this.projectService.exportToSpringBoot(this.projectId).subscribe({
      next: (blob: Blob) => {
        // Crear URL para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `project-${this.projectId}-springboot.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.messageService.add({
          key: 'br',
          severity: 'success',
          summary: 'Exportación exitosa',
          detail: 'Proyecto Spring Boot descargado',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error exporting to Spring Boot:', error);
        this.messageService.add({
          key: 'br',
          severity: 'error',
          summary: 'Error en exportación',
          detail: 'No se pudo generar el proyecto Spring Boot',
          life: 3000
        });
      }
    });
  }

  /**
   * Detecta cualquier cambio en el diagrama y marca como no guardado
   */
  onDiagramChange(event: any): void {
    console.log('[UMLEditor] Diagram change detected:', event.cause);
    this.markAsChanged();
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