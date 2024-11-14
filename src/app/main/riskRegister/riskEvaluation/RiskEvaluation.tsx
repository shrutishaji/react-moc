import Button from "../common/Button";
import RiskInitiation from "./_componests/RiskInitiation";
import EvaluationTasks from "./_componests/EvaluationTasks";
import { Icon } from "@mui/material";
import RiskSection from "./_componests/RiskSection";
import RiskSession from "./_componests/session/RiskSession";
import { useState, useEffect } from "react";
import { IRiskRegisterDetails } from "../helpers/type";
import { useParams } from "react-router";
import { apiAuth } from "src/utils/http";
import FuseLoading from "@fuse/core/FuseLoading";
import { toast } from "react-toastify";

const taskItems = [
  { label: "Total", value: "0" },
  { label: "High Risk", value: "0" },
];

const RiskEvaluation = () => {
  const [risk, setRisk] = useState<IRiskRegisterDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { riskId } = useParams<{ riskId: string }>();

  useEffect(() => {
    apiAuth
      .get(`/RiskRegister/Details/${riskId}`)
      .then((res) => {
        console.log(res.data.data);
        setRisk(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.errorsData.id[0]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  return (
    <>
      {loading && <FuseLoading />}
      {!loading && !risk && (
        <div className="m-5 p-10">
          <div className="flex flex-row w-full justify-between p-5">
            <h2 className="text-2xl font-semibold text-black p-10">
              Risk Not found !
            </h2>
          </div>
        </div>
      )}
      {!loading && risk && (
        <div className="m-5 p-10">
          <div className="flex flex-row w-full justify-between p-5">
            <h2 className="text-2xl font-semibold text-black p-10">
              HIRA #{risk.hiranumber}
            </h2>
            <RiskSession risk={risk} />
          </div>
          <RiskInitiation risk={risk} taskItems={taskItems} />
          <EvaluationTasks />
        </div>
      )}
    </>
  );
};

export default RiskEvaluation;
