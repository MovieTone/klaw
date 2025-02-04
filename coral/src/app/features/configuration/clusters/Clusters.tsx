import { useQuery } from "@tanstack/react-query";
import { TableLayout } from "src/app/features/components/layouts/TableLayout";
import { getClustersPaginated } from "src/domain/cluster";
import { ClustersTable } from "src/app/features/configuration/clusters/components/ClustersTable";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "src/app/components/Pagination";
import {
  useFiltersContext,
  withFiltersContext,
} from "src/app/features/components/filters/useFiltersContext";
import { SearchClusterParamFilter } from "src/app/features/components/filters/SearchClusterParamFilter";

function Clusters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const { search } = useFiltersContext();

  const {
    data: clusters,
    isLoading,
    isError,
    error,
  } = useQuery(["get-clusters-paginated", currentPage, search], {
    queryFn: () =>
      getClustersPaginated({
        pageNo: currentPage.toString(),
        searchClusterParam: search.length === 0 ? undefined : search,
      }),
    keepPreviousData: true,
  });

  function handleChangePage(page: number) {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  }

  const pagination =
    clusters && clusters.totalPages > 1 ? (
      <Pagination
        activePage={clusters.currentPage}
        totalPages={clusters.totalPages}
        setActivePage={handleChangePage}
      />
    ) : undefined;

  return (
    <TableLayout
      filters={[<SearchClusterParamFilter key={"search"} />]}
      table={
        <ClustersTable
          clusters={clusters?.entries || []}
          ariaLabel={`Cluster overview, page ${clusters?.currentPage ?? 0} of ${
            clusters?.totalPages ?? 0
          }`}
        />
      }
      isLoading={isLoading}
      isErrorLoading={isError}
      errorMessage={error}
      pagination={pagination}
    />
  );
}

export default withFiltersContext({ element: <Clusters /> });
