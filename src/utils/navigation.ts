import { DashboardFilter, MitreStageType } from "@/types/security";

export function buildSearchURL(filters: DashboardFilter[]): string {
  const params = new URLSearchParams();
  
  filters.forEach((filter, index) => {
    params.append(`filter_${index}_field`, filter.field);
    params.append(`filter_${index}_operator`, filter.operator);
    params.append(`filter_${index}_value`, filter.value);
  });
  
  return `/search?${params.toString()}`;
}

export function navigateToSearchWithCountry(country: string): string {
  return buildSearchURL([
    {
      field: "country",
      operator: "is",
      value: country,
    },
  ]);
}

export function navigateToSearchWithIP(ip: string): string {
  return buildSearchURL([
    {
      field: "source_ip",
      operator: "is",
      value: ip,
    },
  ]);
}

export function navigateToSearchWithMitreStage(stage: MitreStageType): string {
  return buildSearchURL([
    {
      field: "mitre_stages",
      operator: "is",
      value: stage,
    },
  ]);
}

export function navigateToSearchWithEventType(stage: MitreStageType): string {
  return buildSearchURL([
    {
      field: "event_type",
      operator: "is",
      value: stage,
    },
  ]);
}

export function parseFiltersFromURL(searchParams: URLSearchParams): DashboardFilter[] {
  const filters: DashboardFilter[] = [];
  const filterIndices = new Set<number>();
  
  // Find all filter indices
  searchParams.forEach((_, key) => {
    const match = key.match(/^filter_(\d+)_/);
    if (match) {
      filterIndices.add(parseInt(match[1]));
    }
  });
  
  // Build filters from URL params
  filterIndices.forEach((index) => {
    const field = searchParams.get(`filter_${index}_field`);
    const operator = searchParams.get(`filter_${index}_operator`);
    const value = searchParams.get(`filter_${index}_value`);
    
    if (field && operator && value) {
      filters.push({
        field,
        operator: operator as any,
        value,
      });
    }
  });
  
  return filters;
}
