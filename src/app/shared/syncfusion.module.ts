// shared/syncfusion.module.ts
import { NgModule } from '@angular/core';

// Syncfusion Diagram modules and services (only the ones that exist)
import { 
  DiagramModule, 
  SymbolPaletteModule, 
  OverviewModule,
  DiagramContextMenuService,
  PrintAndExportService,
  BpmnDiagramsService,
  ConnectorEditingService,
  UndoRedoService,
  LayoutAnimationService,
  DataBindingService,
  HierarchicalTreeService,
  MindMapService,
  RadialTreeService,
  ComplexHierarchicalTreeService,
  SymmetricLayoutService,
  LineDistributionService
} from '@syncfusion/ej2-angular-diagrams';

// Additional Syncfusion modules
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  imports: [
    // Core diagram modules
    DiagramModule,
    SymbolPaletteModule,
    OverviewModule,
    
    // Additional UI modules
    ButtonModule,
    DropDownListModule,
    NumericTextBoxModule,
    TextBoxModule,
    ToolbarModule
  ],
  exports: [
    // Core diagram modules
    DiagramModule,
    SymbolPaletteModule,
    OverviewModule,
    
    // Additional UI modules
    ButtonModule,
    DropDownListModule,
    NumericTextBoxModule,
    TextBoxModule,
    ToolbarModule
  ],
  providers: [
    // Essential diagram services that actually exist
    DiagramContextMenuService,
    PrintAndExportService,
    BpmnDiagramsService,
    ConnectorEditingService,
    UndoRedoService,
    LayoutAnimationService,
    DataBindingService,
    
    // Layout services for auto-arrangement
    HierarchicalTreeService,
    MindMapService,
    RadialTreeService,
    ComplexHierarchicalTreeService,
    SymmetricLayoutService,
    LineDistributionService
  ]
})
export class SyncfusionModule {}
