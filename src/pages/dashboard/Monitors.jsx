import { useState, useEffect } from "react";
import { supabase } from "../../db/supabaseClient";
import { useForm } from "react-hook-form";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Flex, TextInput } from "@mantine/core";
import { Table } from "@radix-ui/themes";
import Dashboard from "../../components/Dashboard";
import MonitorRow from "../../components/MonitorRow";

const Monitors = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [monitorsData, setMonitorsData] = useState([]);

  const handleInputChange = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (e) => {
    const { name, image_url } = e;
    const { data, error } = await supabase
      .from("monitors")
      .insert({ name: name, image_url: image_url })
      .select();
    if (error) {
      console.log("ERROR", error);
      setErrorMessage(error.message);
      return;
    } else {
      setSuccessMessage("Monitor added successfully!");
      reset();
      fetchMonitorsData();
      console.log("EVENT", e);
      console.log("DATA", data);
    }
  };

  async function fetchMonitorsData() {
    try {
      const { data, error } = await supabase
        .from("monitors")
        .select("*")
        .order("monitor_id", { ascending: false });

      if (error) {
        throw error;
      }
      console.log(data);
      setMonitorsData(data);
    } catch (error) {
      console.error("Erro ao recuperar dados:", error.message);
    }
  }

  useEffect(() => {
    fetchMonitorsData();
  }, []);

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Dashboard>
      <Modal opened={opened} onClose={close} title="Add Monitor" centered>
        <form onSubmit={handleSubmit(onSubmit)} onChange={handleInputChange}>
          <TextInput
            label="Name"
            placeholder="Name"
            mt="sm"
            {...register("name", {
              required: {
                value: true,
                message: "Preencha o campo de nome",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
          <TextInput
            label="Image"
            placeholder="Image url"
            mt="sm"
            {...register("image_url", {
              required: {
                value: true,
                message: "Preencha o campo de imagem",
              },
              validate: (value) => value.trim() !== "" || "Campo obrigatório",
            })}
          />
          {errors.image_url && (
            <p className="text-sm text-red-600">{errors.image_url.message}</p>
          )}

          <Flex justify="center" align="center">
            <Button fullWidth type="submit" mt="sm" color="grape">
              Add Monitor
            </Button>
          </Flex>
          <Flex>
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {successMessage && (
              <p className="text-green-500">{successMessage}</p>
            )}
          </Flex>
        </form>
      </Modal>

      <Flex justify="end" pb="md">
        <Button onClick={open}>Add Monitor</Button>
      </Flex>

      <Table.Root variant="surface" size={3} layout={"fixed"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {monitorsData.map((monitor) => (
            <MonitorRow
              key={monitor.monitor_id}
              monitor={monitor}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
              successMessage={successMessage}
              setSuccessMessage={setSuccessMessage}
              fetchMonitorsData={fetchMonitorsData}
              handleInputChange={handleInputChange}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Dashboard>
  );
};

export default Monitors;
